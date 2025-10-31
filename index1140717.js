const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 4000;

// 解析 JSON 請求
app.use(express.json());

// 提供 public 資料夾給前端
app.use(express.static(path.join(__dirname, 'public')));

// 連線資料庫
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234', // 請改成你的密碼
    database: 'ztpdollars',
    charset: 'utf8mb4'
});

db.connect(err => {
    if (err) {
        console.error('無法連線資料庫：', err);
    } else {
        console.log('連線成功 MySQL');
    }
});

// 取得所有學生
app.get('/api/students', (req, res) => {
    const sql = 'SELECT id, class, seat_no, name FROM students ORDER BY class, seat_no';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤：', err);
            return res.status(500).send('資料庫查詢錯誤');
        }
        res.json(results);
    });
});

// 取得所有集點資料
app.get('/api/points', (req, res) => {
    const sql = `
        SELECT p.id, s.class, s.seat_no, s.name, p.item, p.standard, p.score, p.created_at
        FROM points p
        JOIN students s ON p.student_id = s.id
        ORDER BY s.class, s.seat_no, p.created_at
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤：', err);
            return res.status(500).send('資料庫查詢錯誤');
        }
        res.json(results);
    });
});

// 新增集點資料
app.post('/api/points', (req, res) => {
    const { student_id, item, standard, score } = req.body;
    if (!student_id || !item || !standard || score === undefined) {
        return res.status(400).send('請提供完整資料');
    }
    const sql = 'INSERT INTO points (student_id, item, standard, score) VALUES (?, ?, ?, ?)';
    db.query(sql, [student_id, item, standard, score], (err, result) => {
        if (err) {
            console.error('資料庫新增錯誤：', err);
            return res.status(500).send('資料庫新增錯誤');
        }
        res.status(201).json({ id: result.insertId });
    });
});

// 刪除集點資料
app.delete('/api/points/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM points WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('資料庫刪除錯誤：', err);
            return res.status(500).send('資料庫刪除錯誤');
        }
        res.json({ deleted: result.affectedRows });
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});