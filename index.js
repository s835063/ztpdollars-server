// index.js - 中壇幣集點系統完整後端（含 Excel 匯出，支援 MySQL 5.7+）
const express = require('express');
const mysql = require('mysql2/promise'); // 使用 Promise 版
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const ExcelJS = require('exceljs');
const cors = require('cors');

const app = express();
const port = 4000;

// === Middleware ===
app.use(cors()); // 允許前端跨域
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === 檔案上傳設定（安全限制）===
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/i)) {
      return cb(new Error('只允許上傳 CSV 檔案！'));
    }
    cb(null, true);
  }
});

// === MySQL 連線池 ===
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ztp123',
  database: 'ztpdollars',
  charset: 'utf8mb4',
  connectionLimit: 10
});

// 測試連線
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('已連線 MySQL');
    connection.release();
  } catch (err) {
    console.error('無法連線資料庫：', err);
  }
})();

// ==================== API ====================

// 匯入學生名單（CSV）
app.post('/api/import-students', upload.single('csv'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '未上傳檔案' });

  const csvPath = path.join(__dirname, req.file.path);
  let importedCount = 0;

  try {
    const csvData = fs.readFileSync(csvPath, 'utf8').trim().split('\n').slice(1);

    for (const line of csvData) {
      const [className, seat_no, name] = line.split(',').map(s => s.trim());
      if (!className || !-seat_no || !name) continue;

      const sql = `
        INSERT INTO students (class, seat_no, name)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE class=?, seat_no=?, name=?
      `;
      await db.execute(sql, [className, seat_no, name, className, seat_no, name]);
      importedCount++;
    }

    fs.unlinkSync(csvPath);
    res.json({ message: `成功匯入 ${importedCount} 筆學生資料` });
  } catch (err) {
    console.error('匯入失敗：', err);
    res.status(500).json({ message: '匯入失敗', error: err.message });
  }
});

// 取得所有學生
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, class, seat_no, name FROM students ORDER BY class, seat_no');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '查詢失敗' });
  }
});

// 取得所有集點資料
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

// 新增集點資料
app.post('/api/points', async (req, res) => {
  const { student_id, item, standard, score } = req.body;
  const numScore = Number(score);

  if (!student_id || !item || !standard || isNaN(numScore)) {
    return res.status(400).json({ message: '資料不完整' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO points (student_id, item, standard, score, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [student_id, item, standard, numScore]
    );
    res.status(201).json({ id: result.insertId, message: '新增成功' });
  } catch (err) {
    console.error('新增錯誤：', err);
    res.status(500).json({ message: '新增失敗', error: err.message });
  }
});

// 刪除集點資料
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

// === 共用：處理 hot 標籤 ===
async function markHotAndSave(results, rankType) {
  if (results.length === 0) return results;

  const studentIds = results.map(r => r.id);
  const now = new Date();

  const [historyRows] = await db.execute(`
    SELECT student_id, ranked_at FROM rank_history
    WHERE student_id IN (?) AND rank_type = ?
  `, [studentIds, rankType]);

  const historyMap = {};
  historyRows.forEach(row => historyMap[row.student_id] = row.ranked_at);

  const finalResults = results.map(r => {
    let isHot = false;

    if (!historyMap[r.id]) {
      db.execute(`INSERT INTO rank_history (student_id, rank_type, ranked_at) VALUES (?, ?, NOW())`, [r.id, rankType]);
      isHot = true;
    } else {
      const rankedAt = new Date(historyMap[r.id]);
      const diffDays = Math.floor((now - rankedAt) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) isHot = true;
    }

    return { ...r, isHot };
  });

  return finalResults;
}

// === 100% 相容 MySQL 5.7 的 Excel 匯出（含各班排行榜）===
app.get('/api/export-backup', async (req, res) => {
  try {
    console.log('開始匯出 Excel 備份...');
    const workbook = new ExcelJS.Workbook();
    const filename = `ztpdollars_backup_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // ===== 工作表 1：學生名單 =====
    const studentsSheet = workbook.addWorksheet('Students');
    studentsSheet.columns = [
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
    ];
    const [students] = await db.execute(`
      SELECT class, seat_no, name 
      FROM students 
      ORDER BY class, seat_no
    `);
    studentsSheet.addRows(students);

    // ===== 工作表 2：集點記錄 =====
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
      FROM points p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.created_at DESC
    `);
    pointsSheet.addRows(points);

    // ===== 工作表 3：全校前30名 =====
    const top30Sheet = workbook.addWorksheet('Top30');
    top30Sheet.columns = [
      { header: '排名', key: 'rank', width: 10 },
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
      { header: '總分', key: 'total_score', width: 12 },
    ];

    const [top30Data] = await db.execute(`
      SELECT s.class, s.seat_no, s.name, IFNULL(SUM(p.score), 0) AS total_score
      FROM students s
      LEFT JOIN points p ON s.id = p.student_id
      GROUP BY s.id
      ORDER BY total_score DESC
      LIMIT 30
    `);

    // 手動加上排名
    top30Data.forEach((row, index) => {
      row.rank = index + 1;
    });
    top30Sheet.addRows(top30Data);

    // ===== 工作表 4：各班所有學生排行榜（MySQL 5.7 相容）=====
    const classRankSheet = workbook.addWorksheet('ClassRank');
    classRankSheet.columns = [
      { header: '班級', key: 'class', width: 15 },
      { header: '座號', key: 'seat_no', width: 10 },
      { header: '姓名', key: 'name', width: 15 },
      { header: '總分', key: 'total_score', width: 12 },
      { header: '班內排名', key: 'class_rank', width: 12 },
    ];

    // 查詢所有學生總分
    const [allStudentScores] = await db.execute(`
      SELECT s.class, s.seat_no, s.name, IFNULL(SUM(p.score), 0) AS total_score
      FROM students s
      LEFT JOIN points p ON s.id = p.student_id
      GROUP BY s.id
      ORDER BY s.class, total_score DESC
    `);

    // 手動計算班內排名
    let currentClass = null;
    let rank = 1;
    allStudentScores.forEach(row => {
      if (row.class !== currentClass) {
        currentClass = row.class;
        rank = 1;
      }
      row.class_rank = rank++;
      classRankSheet.addRow({
        class: row.class,
        seat_no: row.seat_no,
        name: row.name,
        total_score: row.total_score,
        class_rank: row.class_rank
      });
    });

    // ===== 輸出 Excel 檔案 =====
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();

    console.log(`Excel 備份成功匯出：${filename}（含 4 個工作表）`);
  } catch (err) {
    console.error('匯出 Excel 失敗：', err);
    res.status(500).json({
      message: '匯出失敗',
      error: err.message
    });
  }
});

// === 啟動伺服器 ===
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://192.168.0.4:${port}`);
});