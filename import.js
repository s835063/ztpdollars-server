const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '192.168.0.4',
    user: 'root',
    password: 'ztp123',
    database: 'ztpdollars',
    charset: 'utf8mb4'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ 已連線 MySQL');

    let importedCount = 0;
    fs.createReadStream('../allstudents.csv')
        .pipe(csv({ headers: ['class', 'seat_no', 'name'], skipLines: 1 }))
        .on('data', (row) => {
            const sql = `INSERT INTO students (class, seat_no, name)
                         VALUES (?, ?, ?)
                         ON DUPLICATE KEY UPDATE class=?, seat_no=?, name=?`;
            db.query(sql, [row.class, row.seat_no, row.name, row.class, row.seat_no, row.name], (err) => {
                if (err) console.error('❌ 匯入錯誤:', err);
                else importedCount++;
            });
        })
        .on('end', () => {
            console.log(`✅ 成功匯入 ${importedCount} 筆學生資料`);
            db.end();
        });
});