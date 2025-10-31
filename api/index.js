// api/index.js - Vercel Serverless 版中壇幣後端
const express = require('express');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Vercel 暫存上傳
const upload = multer({ dest: '/tmp' });

// === MySQL 連線池（支援 PlanetScale）===
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: true },
  connectionLimit: 10
});

// === 匯入 CSV ===
app.post('/api/import-students', upload.single('csv'), async (req, res) => {
  const fs = require('fs');
  const csv = fs.readFileSync(req.file.path, 'utf8').trim().split('\n').slice(1);
  let count = 0;
  for (const line of csv) {
    const [cls, seat, name] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    if (cls && seat && name) {
      await db.execute(
        `INSERT INTO students (class, seat_no, name) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [cls, seat, name]
      );
      count++;
    }
  }
  fs.unlinkSync(req.file.path);
  res.json({ message: `匯入 ${count} 筆` });
});

// === API 路由 ===
app.get('/api/students', async (req, res) => {
  const [rows] = await db.execute('SELECT id, class, seat_no, name FROM students ORDER BY class, seat_no');
  res.json(rows);
});

app.get('/api/points', async (req, res) => {
  const [rows] = await db.execute(`
    SELECT p.id, s.class, s.seat_no, s.name, p.item, p.standard, p.score, p.created_at
    FROM points p JOIN students s ON p.student_id = s.id
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
});

app.post('/api/points', async (req, res) => {
  const { student_id, item, standard, score } = req.body;
  const [result] = await db.execute(
    `INSERT INTO points (student_id, item, standard, score) VALUES (?, ?, ?, ?)`,
    [student_id, item, standard, score]
  );
  res.status(201).json({ id: result.insertId });
});

app.delete('/api/points/:id', async (req, res) => {
  const [result] = await db.execute('DELETE FROM points WHERE id = ?', [req.params.id]);
  res.json({ deleted: result.affectedRows });
});

app.get('/api/top30', async (req, res) => {
  const [rows] = await db.execute(`
    SELECT s.id, s.class, s.seat_no, s.name, IFNULL(SUM(p.score),0) AS total_score
    FROM students s LEFT JOIN points p ON s.id = p.student_id
    GROUP BY s.id ORDER BY total_score DESC LIMIT 30
  `);
  res.json(rows);
});

// === Excel 匯出 ===
app.get('/api/export-backup', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const filename = `ztpdollars_backup_${new Date().toISOString().slice(0,10)}.xlsx`;

  // Students Sheet
  const sheet1 = workbook.addWorksheet('Students');
  sheet1.columns = [
    { header: '班級', key: 'class', width: 15 },
    { header: '座號', key: 'seat_no', width: 10 },
    { header: '姓名', key: 'name', width: 15 }
  ];
  const [students] = await db.execute('SELECT class, seat_no, name FROM students ORDER BY class, seat_no');
  sheet1.addRows(students);

  // Points Sheet
  const sheet2 = workbook.addWorksheet('Points');
  sheet2.columns = [
    { header: '班級', key: 'class', width: 15 },
    { header: '座號', key: 'seat_no', width: 10 },
    { header: '姓名', key: 'name', width: 15 },
    { header: '項目', key: 'item', width: 20 },
    { header: '標準', key: 'standard', width: 30 },
    { header: '點數', key: 'score', width: 10 },
    { header: '時間', key: 'created_at', width: 20 }
  ];
  const [points] = await db.execute(`
    SELECT s.class, s.seat_no, s.name, p.item, p.standard, p.score, p.created_at
    FROM points p JOIN students s ON p.student_id = s.id
    ORDER BY p.created_at DESC
  `);
  sheet2.addRows(points);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = app;
