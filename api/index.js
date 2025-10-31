// api/index.js - Vercel Serverless 版中壇幣後端
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const ExcelJS = require('exceljs');
const cors = require('cors');

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// 靜態檔案（可選）
app.use(express.static(path.join(__dirname, '../public')));

// === 檔案上傳（Vercel 使用 /tmp）===
const upload = multer({
  dest: '/tmp',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/i)) {
      return cb(new Error('只允許 CSV！'));
    }
    cb(null, true);
  }
});

// === MySQL 連線池（使用環境變數）===
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ztp123',
  database: process.env.DB_NAME || 'ztpdollars',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// 測試連線
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('MySQL 連線成功');
    conn.release();
  } catch (err) {
    console.error('MySQL 連線失敗：', err.message);
  }
})();

// ==================== API ====================

// 匯入學生名單
app.post('/api/import-students', upload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '未上傳檔案' });

  const csvPath = req.file.path;
  let importedCount = 0;

  try {
    const csvData = fs.readFileSync(csvPath, 'utf8').trim().split('\n').slice(1);

    for (const line of csvData) {
      const [className, seat_no, name] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (!className || !seat_no || !name) continue;

      const sql = `
        INSERT INTO students (class, seat_no, name)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name)
      `;
      await db.execute(sql, [className, seat_no, name]);
      importedCount++;
    }

    fs.unlinkSync(csvPath);
    res.json({ message: `成功匯入 ${importedCount} 筆` });
  } catch (err) {
    console.error('匯入失敗：', err);
    res.status(500).json({ message: '匯入失敗', error: err.message });
  }
});

// 取得學生
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, class, seat_no, name FROM students ORDER BY class, seat_no');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '查詢失敗' });
  }
});

// 取得集點
app.get('/api/points', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.id, s.class, s.seat_no, s.name, p.item, p.standard, p.score, p.created_at
      FROM points p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '查詢失敗' });
  }
});

// 新增集點
app.post('/api/points', async (req, res) => {
  const { student_id, item, standard, score } = req.body;
  const numScore = Number(score);

  if (!student_id || !item || !standard || isNaN(numScore)) {
    return res.status(400).json({ message: '資料不完整' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO points (student_id, item, standard, score) VALUES (?, ?, ?, ?)`,
      [student_id, item, standard, numScore]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: '新增失敗', error: err.message });
  }
});

// 刪除集點
app.delete('/api/points/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM points WHERE id = ?', [req.params.id]);
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    res.status(500).json({ message: '刪除失敗' });
  }
});

// 全校前30名
app.get('/api/top30', async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT s.id, s.class, s.seat_no, s.name, IFNULL(SUM(p.score),0) AS total_score
      FROM students s
      LEFT JOIN points p ON s.id = p.student_id
      GROUP BY s.id
      ORDER BY total_score DESC
      LIMIT 30
    `);
    res.json(await markHotAndSave(results, 'top30'));
  } catch (err) {
    res.status(500).json({ message: '查詢失敗' });
  }
});

// 各班前6名
app.get('/api/top6', async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT s.id, s.class, s.seat_no, s.name, IFNULL(SUM(p.score),0) AS total_score
      FROM students s
      LEFT JOIN points p ON s.id = p.student_id
      GROUP BY s.id
      ORDER BY s.class, total_score DESC
    `);

    const grouped = {};
    results.forEach(r => {
      if (!grouped[r.class]) grouped[r.class] = [];
      if (grouped[r.class].length < 6) grouped[r.class].push(r);
    });

    const top6Results = Object.values(grouped).flat();
    res.json(await markHotAndSave(top6Results, 'class6'));
  } catch (err) {
    res.status(500).json({ message: '查詢失敗' });
  }
});

// === hot 標記 ===
async function markHotAndSave(results, rankType) {
  if (results.length === 0) return results;

  const studentIds = results.map(r => r.id);
  const now = new Date();

  const [history] = await db.execute(`
    SELECT student_id, ranked_at FROM rank_history
    WHERE student_id IN (?) AND rank_type = ?
  `, [studentIds, rankType]);

  const historyMap = Object.fromEntries(history.map(h => [h.student_id, h.ranked_at]));

  for (const r of results) {
    const lastRanked = historyMap[r.id] ? new Date(historyMap[r.id]) : null;
    const diffDays = lastRanked ? Math.floor((now - lastRanked) / (1000 * 60 * 60 * 24)) : Infinity;

    if (!lastRanked || diffDays >= 7) {
      await db.execute(
        `INSERT INTO rank_history (student_id, rank_type) VALUES (?, ?) ON DUPLICATE KEY UPDATE ranked_at = NOW()`,
        [r.id, rankType]
      );
      r.isHot = true;
    } else {
      r.isHot = diffDays < 7;
    }
  }

  return results;
}

// === Excel 匯出 ===
app.get('/api/export-backup', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const filename = `ztpdollars_backup_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // Students
    const studentsSheet = workbook.addWorksheet('Students');
    studentsSheet.columns = [
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
    ];
    const [students] = await db.execute('SELECT class, seat_no, name FROM students ORDER BY class, seat_no');
    studentsSheet.addRows(students);

    // Points
    const pointsSheet = workbook.addWorksheet('Points');
    pointsSheet.columns = [
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
      { header: '項目', key: 'item', width: 20 },
      { header: '標準', key: 'standard', width: 30 },
      { header: '分數', key: 'score', width: 10 },
      { header: '時間', key: 'created_at', width: 20 },
    ];
    const [points] = await db.execute(`
      SELECT s.class, s.seat_no, s.name, p.item, p.standard, p.score, p.created_at
      FROM points p JOIN students s ON p.student_id = s.id
      ORDER BY p.created_at DESC
    `);
    pointsSheet.addRows(points);

    // Top30
    const top30Sheet = workbook.addWorksheet('Top30');
    top30Sheet.columns = [
      { header: '排名', key: 'rank', width: 10 },
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
      { header: '總分', key: 'total_score', width: 12 },
    ];
    const [top30] = await db.execute(`
      SELECT s.class, s.seat_no, s.name, IFNULL(SUM(p.score),0) AS total_score
      FROM students s LEFT JOIN points p ON s.id = p.student_id
      GROUP BY s.id ORDER BY total_score DESC LIMIT 30
    `);
    top30.forEach((row, i) => row.rank = i + 1);
    top30Sheet.addRows(top30);

    // Class Rank
    const classRankSheet = workbook.addWorksheet('ClassRank');
    classRankSheet.columns = [
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
      { header: '總分', key: 'total_score', width: 12 },
      { header: '班內排名', key: 'class_rank', width: 12 },
    ];
    const [allScores] = await db.execute(`
      SELECT s.class, s.seat_no, s.name, IFNULL(SUM(p.score),0) AS total_score
      FROM students s LEFT JOIN points p ON s.id = p.student_id
      GROUP BY s.id ORDER BY s.class, total_score DESC
    `);
    let currentClass = null, rank = 1;
    allScores.forEach(row => {
      if (row.class !== currentClass) { currentClass = row.class; rank = 1; }
      classRankSheet.addRow({ ...row, class_rank: rank++ });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '匯出失敗' });
  }
});

// === Vercel 導出 ===
module.exports = app;