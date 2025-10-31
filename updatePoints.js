const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const csv = require('csv-parser');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root1234', // 請改成你的 MySQL 密碼
    database: 'ztpdollars'
});

db.connect(err => {
    if (err) throw err;
    console.log('成功連線到資料庫 ztpdollars');
    updatePoints();
});

function updatePoints() {
    const filePath = path.join(__dirname, '../data/points.csv'); // CSV 路徑
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
          // 顯示每列讀取到的資料
          console.log('讀取資料:', data);
          rows.push(data);
      })
      .on('end', () => {
          console.log(`讀取 ${rows.length} 筆資料`);
          insertPoints(rows);
      });
}

function insertPoints(rows) {
    rows.forEach(row => {
        const { class: cls, seat_no, name, item, standard, score } = row;

        // 空值檢查
        if (!cls || !seat_no || !name || !item || !standard || !score) {
            console.warn('跳過空值資料:', row);
            return;
        }

        // 先取得學生 id
        db.query(`SELECT id FROM students WHERE class=? AND seat_no=? AND name=?`, [cls, seat_no, name], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            let studentId;
            if (result.length > 0) {
                studentId = result[0].id;
                savePoint(studentId, item, standard, score);
            } else {
                // 若學生不存在，先新增學生
                db.query(`INSERT INTO students (class, seat_no, name) VALUES (?,?,?)`, [cls, seat_no, name], (err, res) => {
                    if (err) { console.error(err); return; }
                    studentId = res.insertId;
                    savePoint(studentId, item, standard, score);
                });
            }
        });
    });
}

function savePoint(studentId, item, standard, score) {
    db.query(`INSERT INTO points (student_id, item, standard, score) VALUES (?,?,?,?)`, 
        [studentId, item, standard, parseInt(score)], 
        (err, res) => {
            if (err) console.error(err);
            else console.log(`新增學生 ${studentId} 點數 ${score} 成功`);
        }
    );
}
