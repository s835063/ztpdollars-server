const mysql = require('mysql2');

// 連接到 MySQL 資料庫
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'ztp123',
    database: 'ztpdollars',
    charset: 'utf8mb4'
});

// JSON 資料
const pointsData = [
    {"id":241,"class":"一年忠班","seat_no":1,"name":"李浩佑\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:24:30.000Z"},
    {"id":242,"class":"一年忠班","seat_no":1,"name":"李浩佑\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:24:34.000Z"},
    {"id":15,"class":"一年忠班","seat_no":3,"name":"陳宏奕\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:02.000Z"},
    {"id":17,"class":"一年忠班","seat_no":4,"name":"邱晨恩\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:20.000Z"},
    {"id":16,"class":"一年忠班","seat_no":5,"name":"林志樂\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:17.000Z"},
    {"id":18,"class":"一年忠班","seat_no":7,"name":"邱 靖\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:26.000Z"},
    {"id":19,"class":"一年忠班","seat_no":8,"name":"戴尉丹\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:32.000Z"},
    {"id":20,"class":"一年忠班","seat_no":9,"name":"翁世坤\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:37.000Z"},
    {"id":21,"class":"一年忠班","seat_no":10,"name":"楊達銘\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:41.000Z"},
    {"id":22,"class":"一年忠班","seat_no":11,"name":"楊崎楷\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:46.000Z"},
    {"id":23,"class":"一年忠班","seat_no":12,"name":"謝天喜\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:50.000Z"},
    {"id":24,"class":"一年忠班","seat_no":13,"name":"洪妤媃\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:54.000Z"},
    {"id":25,"class":"一年忠班","seat_no":15,"name":"陳語恩\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:29:59.000Z"},
    {"id":26,"class":"一年忠班","seat_no":16,"name":"鍾苡心\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:04.000Z"},
    {"id":27,"class":"一年忠班","seat_no":17,"name":"林琳夏\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:09.000Z"},
    {"id":28,"class":"一年忠班","seat_no":18,"name":"蕭任容\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:13.000Z"},
    {"id":239,"class":"一年忠班","seat_no":18,"name":"蕭任容\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:23:57.000Z"},
    {"id":240,"class":"一年忠班","seat_no":18,"name":"蕭任容\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:24:14.000Z"},
    {"id":243,"class":"一年忠班","seat_no":19,"name":"林宣汝\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:24:50.000Z"},
    {"id":244,"class":"一年忠班","seat_no":19,"name":"林宣汝\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:24:57.000Z"},
    {"id":29,"class":"一年忠班","seat_no":22,"name":"黃宥涵\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:20.000Z"},
    {"id":30,"class":"一年忠班","seat_no":23,"name":"李唯歆\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:25.000Z"},
    {"id":165,"class":"三年孝班","seat_no":2,"name":"賴宥穎\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-23T06:55:41.000Z"},
    {"id":331,"class":"三年孝班","seat_no":2,"name":"賴宥穎\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:31:41.000Z"},
    {"id":406,"class":"三年孝班","seat_no":2,"name":"賴宥穎\r","item":"其他表現","standard":"特殊表現好人好事200","score":100,"created_at":"2025-10-22T02:16:10.000Z"},
    {"id":332,"class":"三年孝班","seat_no":3,"name":"劉嘉\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1800,"created_at":"2025-10-09T06:31:54.000Z"},
    {"id":189,"class":"三年孝班","seat_no":4,"name":"張正宏\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:35:10.000Z"},
    {"id":333,"class":"三年孝班","seat_no":4,"name":"張正宏\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":300,"created_at":"2025-10-09T06:32:01.000Z"},
    {"id":110,"class":"三年孝班","seat_no":5,"name":"陳彥宇\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:48:06.000Z"},
    {"id":334,"class":"三年孝班","seat_no":5,"name":"陳彥宇\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":700,"created_at":"2025-10-09T06:32:12.000Z"},
    {"id":407,"class":"三年孝班","seat_no":5,"name":"陳彥宇\r","item":"其他表現","standard":"特殊表現好人好事200","score":100,"created_at":"2025-10-22T02:16:20.000Z"},
    {"id":335,"class":"三年孝班","seat_no":6,"name":"馮彥祖\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:32:21.000Z"},
    {"id":41,"class":"三年孝班","seat_no":8,"name":"陳建諺\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:32:44.000Z"},
    {"id":290,"class":"三年孝班","seat_no":8,"name":"陳建諺\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:00:23.000Z"},
    {"id":336,"class":"三年孝班","seat_no":8,"name":"陳建諺\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":300,"created_at":"2025-10-09T06:32:33.000Z"},
    {"id":337,"class":"三年孝班","seat_no":9,"name":"鍾霈辰\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":600,"created_at":"2025-10-09T06:32:43.000Z"},
    {"id":226,"class":"三年孝班","seat_no":10,"name":"徐縈瑄\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T01:59:19.000Z"},
    {"id":282,"class":"三年孝班","seat_no":11,"name":"陳云汝\r","item":"其他表現","standard":"特殊表現好人好事200","score":200,"created_at":"2025-10-03T01:42:03.000Z"},
    {"id":338,"class":"三年孝班","seat_no":11,"name":"陳云汝\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:32:51.000Z"},
    {"id":40,"class":"三年孝班","seat_no":12,"name":"涂巧緹\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:32:34.000Z"},
    {"id":111,"class":"三年孝班","seat_no":13,"name":"楊芷昕\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:48:15.000Z"},
    {"id":230,"class":"三年孝班","seat_no":13,"name":"楊芷昕\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:00:40.000Z"},
    {"id":339,"class":"三年孝班","seat_no":13,"name":"楊芷昕\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:33:00.000Z"},
    {"id":229,"class":"三年孝班","seat_no":14,"name":"曾歆芮\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:00:24.000Z"},
    {"id":340,"class":"三年孝班","seat_no":14,"name":"曾歆芮\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:33:09.000Z"},
    {"id":341,"class":"三年孝班","seat_no":15,"name":"謝天巧\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":400,"created_at":"2025-10-09T06:33:16.000Z"},
    {"id":342,"class":"三年孝班","seat_no":16,"name":"華婕妤\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:33:28.000Z"},
    {"id":106,"class":"三年忠班","seat_no":3,"name":"宋衡奕\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:47:16.000Z"},
    {"id":326,"class":"三年忠班","seat_no":6,"name":"楊展熏\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1900,"created_at":"2025-10-09T06:30:37.000Z"},
    {"id":39,"class":"三年忠班","seat_no":7,"name":"溫定穎","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:32:01.000Z"},
    {"id":286,"class":"三年忠班","seat_no":7,"name":"溫定穎","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T06:59:03.000Z"},
    {"id":327,"class":"三年忠班","seat_no":7,"name":"溫定穎","item":"線上喜閱網闖關","standard":"依該書點數換算","score":10000,"created_at":"2025-10-09T06:30:47.000Z"},
    {"id":289,"class":"三年忠班","seat_no":9,"name":"曾筠茜\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:00:04.000Z"},
    {"id":328,"class":"三年忠班","seat_no":9,"name":"曾筠茜\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":400,"created_at":"2025-10-09T06:30:57.000Z"},
    {"id":107,"class":"三年忠班","seat_no":11,"name":"李馥妤\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:47:25.000Z"},
    {"id":231,"class":"三年忠班","seat_no":11,"name":"李馥妤\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:01:16.000Z"},
    {"id":329,"class":"三年忠班","seat_no":12,"name":"林芯柔","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:31:10.000Z"},
    {"id":108,"class":"三年忠班","seat_no":13,"name":"楊子妍\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:47:32.000Z"},
    {"id":38,"class":"三年忠班","seat_no":14,"name":"蔡奕緹\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:31:52.000Z"},
    {"id":287,"class":"三年忠班","seat_no":14,"name":"蔡奕緹\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T06:59:23.000Z"},
    {"id":37,"class":"三年忠班","seat_no":15,"name":"蕭韶貝\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:31:44.000Z"},
    {"id":109,"class":"三年忠班","seat_no":15,"name":"蕭韶貝\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:47:38.000Z"},
    {"id":232,"class":"三年忠班","seat_no":15,"name":"蕭韶貝\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:01:41.000Z"},
    {"id":288,"class":"三年忠班","seat_no":15,"name":"蕭韶貝\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T06:59:38.000Z"},
    {"id":330,"class":"三年忠班","seat_no":15,"name":"蕭韶貝\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":2600,"created_at":"2025-10-09T06:31:22.000Z"},
    {"id":398,"class":"三年忠班","seat_no":15,"name":"蕭韶貝\r","item":"代表學校參加校外比賽","standard":"佳作入選200","score":200,"created_at":"2025-10-14T00:18:54.000Z"},
    {"id":308,"class":"二年忠班","seat_no":2,"name":"吳宇恩\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":800,"created_at":"2025-10-09T06:26:45.000Z"},
    {"id":309,"class":"二年忠班","seat_no":3,"name":"劉祐愷 \r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:27:15.000Z"},
    {"id":33,"class":"二年忠班","seat_no":4,"name":"劉俊葳\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:31:01.000Z"},
    {"id":285,"class":"二年忠班","seat_no":4,"name":"劉俊葳\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T06:58:31.000Z"},
    {"id":310,"class":"二年忠班","seat_no":4,"name":"劉俊葳\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1200,"created_at":"2025-10-09T06:27:24.000Z"},
    {"id":311,"class":"二年忠班","seat_no":5,"name":" 羅念竹\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":600,"created_at":"2025-10-09T06:27:34.000Z"},
    {"id":312,"class":"二年忠班","seat_no":6,"name":"韓定愷\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:27:42.000Z"},
    {"id":31,"class":"二年忠班","seat_no":7,"name":"謝成津","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:44.000Z"},
    {"id":313,"class":"二年忠班","seat_no":7,"name":"謝成津","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1300,"created_at":"2025-10-09T06:27:49.000Z"},
    {"id":36,"class":"二年忠班","seat_no":8,"name":"劉恩睿\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:31:26.000Z"},
    {"id":169,"class":"二年忠班","seat_no":8,"name":"劉恩睿\r","item":"校內比賽","standard":"基本參賽","score":100,"created_at":"2025-09-26T00:17:42.000Z"},
    {"id":284,"class":"二年忠班","seat_no":8,"name":"劉恩睿\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T06:57:59.000Z"},
    {"id":314,"class":"二年忠班","seat_no":8,"name":"劉恩睿\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1400,"created_at":"2025-10-09T06:27:57.000Z"},
    {"id":34,"class":"二年忠班","seat_no":9,"name":"劉旭昌\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:31:08.000Z"},
    {"id":105,"class":"二年忠班","seat_no":9,"name":"劉旭昌\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:46:53.000Z"},
    {"id":315,"class":"二年忠班","seat_no":9,"name":"劉旭昌\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":900,"created_at":"2025-10-09T06:28:05.000Z"},
    {"id":316,"class":"二年忠班","seat_no":10,"name":"邱宇綸\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":4100,"created_at":"2025-10-09T06:28:15.000Z"},
    {"id":317,"class":"二年忠班","seat_no":11,"name":"劉宥陞\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:28:23.000Z"},
    {"id":35,"class":"二年忠班","seat_no":13,"name":"李昕頤\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:31:16.000Z"},
    {"id":166,"class":"二年忠班","seat_no":13,"name":"李昕頤\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-23T06:56:17.000Z"},
    {"id":251,"class":"二年忠班","seat_no":13,"name":"李昕頤\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:26:17.000Z"},
    {"id":252,"class":"二年忠班","seat_no":13,"name":"李昕頤\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:26:22.000Z"},
    {"id":318,"class":"二年忠班","seat_no":13,"name":"李昕頤\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":3200,"created_at":"2025-10-09T06:28:39.000Z"},
    {"id":319,"class":"二年忠班","seat_no":14,"name":"黃品芸\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:28:47.000Z"},
    {"id":320,"class":"二年忠班","seat_no":15,"name":" 鍾語芹\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1100,"created_at":"2025-10-09T06:28:56.000Z"},
    {"id":321,"class":"二年忠班","seat_no":16,"name":"黃郡妃\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":300,"created_at":"2025-10-09T06:29:04.000Z"},
    {"id":32,"class":"二年忠班","seat_no":17,"name":"吳惠甯\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:30:51.000Z"},
    {"id":253,"class":"二年忠班","seat_no":17,"name":"吳惠甯\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:26:38.000Z"},
    {"id":254,"class":"二年忠班","seat_no":17,"name":"吳惠甯\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:26:44.000Z"},
    {"id":322,"class":"二年忠班","seat_no":17,"name":"吳惠甯\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":17300,"created_at":"2025-10-09T06:29:16.000Z"},
    {"id":170,"class":"二年忠班","seat_no":19,"name":"楊芯甯\r","item":"校內比賽","standard":"基本參賽","score":100,"created_at":"2025-09-26T00:18:01.000Z"},
    {"id":255,"class":"二年忠班","seat_no":19,"name":"楊芯甯\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:26:55.000Z"},
    {"id":256,"class":"二年忠班","seat_no":19,"name":"楊芯甯\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:26:59.000Z"},
    {"id":323,"class":"二年忠班","seat_no":19,"name":"楊芯甯\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":2200,"created_at":"2025-10-09T06:29:35.000Z"},
    {"id":324,"class":"二年忠班","seat_no":20,"name":" 黃筠靜\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":600,"created_at":"2025-10-09T06:29:45.000Z"},
    {"id":325,"class":"二年忠班","seat_no":21,"name":"伍婉綾\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:29:54.000Z"},
    {"id":65,"class":"五年孝班","seat_no":1,"name":"劉曜綸\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:18.000Z"},
    {"id":69,"class":"五年孝班","seat_no":4,"name":"李享金\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:40.000Z"},
    {"id":64,"class":"五年孝班","seat_no":5,"name":"林翊祥\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:11.000Z"},
    {"id":182,"class":"五年孝班","seat_no":5,"name":"林翊祥\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:33:54.000Z"},
    {"id":376,"class":"五年孝班","seat_no":5,"name":"林翊祥\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:39:10.000Z"},
    {"id":119,"class":"五年孝班","seat_no":6,"name":"楊錡恩\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:49:42.000Z"},
    {"id":299,"class":"五年孝班","seat_no":6,"name":"楊錡恩\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:02:54.000Z"},
    {"id":377,"class":"五年孝班","seat_no":7,"name":"鍾旻恩\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:39:16.000Z"},
    {"id":378,"class":"五年孝班","seat_no":7,"name":"鍾旻恩\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:39:26.000Z"},
    {"id":68,"class":"五年孝班","seat_no":8,"name":"林文武\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:36.000Z"},
    {"id":120,"class":"五年孝班","seat_no":8,"name":"林文武\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:49:46.000Z"},
    {"id":379,"class":"五年孝班","seat_no":8,"name":"林文武\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1400,"created_at":"2025-10-09T06:39:33.000Z"},
    {"id":380,"class":"五年孝班","seat_no":9,"name":"蔡宇勛\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:39:40.000Z"},
    {"id":67,"class":"五年孝班","seat_no":11,"name":"黃雨萌\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:31.000Z"},
    {"id":237,"class":"五年孝班","seat_no":11,"name":"黃雨萌\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:04:12.000Z"},
    {"id":298,"class":"五年孝班","seat_no":11,"name":"黃雨萌\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:02:39.000Z"},
    {"id":381,"class":"五年孝班","seat_no":12,"name":"張羽彤\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:39:48.000Z"},
    {"id":66,"class":"五年孝班","seat_no":15,"name":"劉于柔","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:25.000Z"},
    {"id":382,"class":"五年孝班","seat_no":15,"name":"劉于柔","item":"線上喜閱網闖關","standard":"依該書點數換算","score":300,"created_at":"2025-10-09T06:39:57.000Z"},
    {"id":404,"class":"五年孝班","seat_no":15,"name":"劉于柔","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-14T00:24:48.000Z"},
    {"id":53,"class":"五年忠班","seat_no":1,"name":"李禹銳\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:34:59.000Z"},
    {"id":236,"class":"五年忠班","seat_no":1,"name":"李禹銳\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:04:00.000Z"},
    {"id":362,"class":"五年忠班","seat_no":1,"name":"李禹銳\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:37:14.000Z"},
    {"id":51,"class":"五年忠班","seat_no":2,"name":"邱煦凱\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:34:45.000Z"},
    {"id":178,"class":"五年忠班","seat_no":2,"name":"邱煦凱\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:32:46.000Z"},
    {"id":295,"class":"五年忠班","seat_no":2,"name":"邱煦凱\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:01:55.000Z"},
    {"id":363,"class":"五年忠班","seat_no":2,"name":"邱煦凱\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1900,"created_at":"2025-10-09T06:37:20.000Z"},
    {"id":75,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:56:48.000Z"},
    {"id":97,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"代表學校參加校外比賽","standard":"基本參賽","score":500,"created_at":"2025-09-17T06:02:07.000Z"},
    {"id":117,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:49:10.000Z"},
    {"id":171,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"代表學校參加校外比賽","standard":"基本參賽","score":500,"created_at":"2025-09-26T00:19:44.000Z"},
    {"id":179,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:33:16.000Z"},
    {"id":235,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"代表學校參加校外比賽","standard":"基本參賽500","score":500,"created_at":"2025-10-02T02:03:35.000Z"},
    {"id":364,"class":"五年忠班","seat_no":3,"name":"楊浩悅\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:37:27.000Z"},
    {"id":56,"class":"五年忠班","seat_no":4,"name":"鍾奇桓\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:35:16.000Z"},
    {"id":365,"class":"五年忠班","seat_no":4,"name":"鍾奇桓\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":500,"created_at":"2025-10-09T06:37:34.000Z"},
    {"id":50,"class":"五年忠班","seat_no":5,"name":"郭紘劭\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:34:41.000Z"},
    {"id":366,"class":"五年忠班","seat_no":5,"name":"郭紘劭\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":800,"created_at":"2025-10-09T06:37:44.000Z"},
    {"id":367,"class":"五年忠班","seat_no":6,"name":"陳彥碩\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":2100,"created_at":"2025-10-09T06:37:51.000Z"},
    {"id":63,"class":"五年忠班","seat_no":7,"name":"李侑儒\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:38:54.000Z"},
    {"id":180,"class":"五年忠班","seat_no":7,"name":"李侑儒\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:33:29.000Z"},
    {"id":368,"class":"五年忠班","seat_no":7,"name":"李侑儒\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1200,"created_at":"2025-10-09T06:37:57.000Z"},
    {"id":59,"class":"五年忠班","seat_no":9,"name":"賴丞翌\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:36:00.000Z"},
    {"id":245,"class":"五年忠班","seat_no":9,"name":"賴丞翌\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:25:14.000Z"},
    {"id":246,"class":"五年忠班","seat_no":9,"name":"賴丞翌\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:25:21.000Z"},
    {"id":369,"class":"五年忠班","seat_no":9,"name":"賴丞翌\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1400,"created_at":"2025-10-09T06:38:09.000Z"},
    {"id":249,"class":"五年忠班","seat_no":10,"name":"劉哲瑋\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:25:55.000Z"},
    {"id":250,"class":"五年忠班","seat_no":10,"name":"劉哲瑋\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:26:00.000Z"},
    {"id":370,"class":"五年忠班","seat_no":10,"name":"劉哲瑋\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1500,"created_at":"2025-10-09T06:38:17.000Z"},
    {"id":371,"class":"五年忠班","seat_no":11,"name":"劉芷妍\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":900,"created_at":"2025-10-09T06:38:27.000Z"},
    {"id":78,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:57:07.000Z"},
    {"id":98,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"代表學校參加校外比賽","standard":"基本參賽","score":500,"created_at":"2025-09-17T06:02:39.000Z"},
    {"id":99,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"代表學校參加校外比賽","standard":"佳作入選","score":200,"created_at":"2025-09-17T06:02:42.000Z"},
    {"id":247,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:25:33.000Z"},
    {"id":248,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:25:39.000Z"},
    {"id":372,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":3700,"created_at":"2025-10-09T06:38:34.000Z"},
    {"id":405,"class":"五年忠班","seat_no":12,"name":"郭欣銣\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-14T00:24:56.000Z"},
    {"id":55,"class":"五年忠班","seat_no":13,"name":"吳絜玲\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:35:12.000Z"},
    {"id":296,"class":"五年忠班","seat_no":13,"name":"吳絜玲\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:02:06.000Z"},
    {"id":373,"class":"五年忠班","seat_no":13,"name":"吳絜玲\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1100,"created_at":"2025-10-09T06:38:42.000Z"},
    {"id":118,"class":"五年忠班","seat_no":14,"name":"傅萭臻\r","item":"客語認證","standard":"基本參賽","score":200,"created_at":"2025-09-19T00:49:15.000Z"},
    {"id":374,"class":"五年忠班","seat_no":14,"name":"傅萭臻\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:38:52.000Z"},
    {"id":57,"class":"五年忠班","seat_no":15,"name":"傅滿蕙\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:35:49.000Z"},
    {"id":181,"class":"五年忠班","seat_no":15,"name":"傅滿蕙\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:33:39.000Z"},
    {"id":297,"class":"五年忠班","seat_no":15,"name":"傅滿蕙\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:02:19.000Z"},
    {"id":375,"class":"五年忠班","seat_no":15,"name":"傅滿蕙\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":900,"created_at":"2025-10-09T06:38:59.000Z"},
    {"id":140,"class":"六年孝班","seat_no":1,"name":"劉宥昕\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T03:35:24.000Z"},
    {"id":391,"class":"六年孝班","seat_no":1,"name":"劉宥昕\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:41:14.000Z"},
    {"id":150,"class":"六年孝班","seat_no":2,"name":"劉翌捷\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:34:25.000Z"},
    {"id":71,"class":"六年孝班","seat_no":3,"name":"李翰昀\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:41:05.000Z"},
    {"id":142,"class":"六年孝班","seat_no":3,"name":"李翰昀\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T03:36:08.000Z"},
    {"id":302,"class":"六年孝班","seat_no":3,"name":"李翰昀\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:05:54.000Z"},
    {"id":392,"class":"六年孝班","seat_no":3,"name":"李翰昀\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":2000,"created_at":"2025-10-09T06:41:25.000Z"},
    {"id":403,"class":"六年孝班","seat_no":3,"name":"李翰昀\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-14T00:24:35.000Z"},
    {"id":151,"class":"六年孝班","seat_no":5,"name":"楊展睿\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:34:36.000Z"},
    {"id":261,"class":"六年孝班","seat_no":5,"name":"楊展睿\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:27:44.000Z"},
    {"id":262,"class":"六年孝班","seat_no":5,"name":"楊展睿\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:27:50.000Z"},
    {"id":303,"class":"六年孝班","seat_no":5,"name":"楊展睿\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:06:57.000Z"},
    {"id":393,"class":"六年孝班","seat_no":5,"name":"楊展睿\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1000,"created_at":"2025-10-09T06:41:33.000Z"},
    {"id":152,"class":"六年孝班","seat_no":6,"name":"楊詠翔\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:34:46.000Z"},
    {"id":153,"class":"六年孝班","seat_no":8,"name":"郭永強\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:34:54.000Z"},
    {"id":154,"class":"六年孝班","seat_no":9,"name":"劉羿伶\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:35:02.000Z"},
    {"id":259,"class":"六年孝班","seat_no":9,"name":"劉羿伶\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:27:29.000Z"},
    {"id":260,"class":"六年孝班","seat_no":9,"name":"劉羿伶\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:27:34.000Z"},
    {"id":394,"class":"六年孝班","seat_no":9,"name":"劉羿伶\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:41:44.000Z"},
    {"id":155,"class":"六年孝班","seat_no":10,"name":"謝婕方\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:35:12.000Z"},
    {"id":395,"class":"六年孝班","seat_no":10,"name":"謝婕方\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:41:50.000Z"},
    {"id":73,"class":"六年孝班","seat_no":11,"name":"蕭妍芯\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:41:14.000Z"},
    {"id":156,"class":"六年孝班","seat_no":11,"name":"蕭妍芯\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:35:20.000Z"},
    {"id":257,"class":"六年孝班","seat_no":11,"name":"蕭妍芯\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:27:16.000Z"},
    {"id":258,"class":"六年孝班","seat_no":11,"name":"蕭妍芯\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:27:20.000Z"},
    {"id":396,"class":"六年孝班","seat_no":11,"name":"蕭妍芯\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:41:59.000Z"},
    {"id":72,"class":"六年孝班","seat_no":13,"name":"黃品慈\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:41:09.000Z"},
    {"id":157,"class":"六年孝班","seat_no":13,"name":"黃品慈\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-22T04:35:29.000Z"},
    {"id":301,"class":"六年孝班","seat_no":13,"name":"黃品慈\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:05:42.000Z"},
    {"id":397,"class":"六年孝班","seat_no":13,"name":"黃品慈\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":200,"created_at":"2025-10-09T06:42:06.000Z"},
    {"id":383,"class":"六年忠班","seat_no":1,"name":"林祺恩\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:40:08.000Z"},
    {"id":183,"class":"六年忠班","seat_no":2,"name":"劉宜定\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:34:10.000Z"},
    {"id":384,"class":"六年忠班","seat_no":2,"name":"劉宜定\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":300,"created_at":"2025-10-09T06:40:14.000Z"},
    {"id":385,"class":"六年忠班","seat_no":3,"name":"劉宥杰\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":800,"created_at":"2025-10-09T06:40:21.000Z"},
    {"id":70,"class":"六年忠班","seat_no":4,"name":"林恩樑\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:40:54.000Z"},
    {"id":172,"class":"六年忠班","seat_no":4,"name":"林恩樑\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-26T03:22:05.000Z"},
    {"id":184,"class":"六年忠班","seat_no":4,"name":"林恩樑\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:34:18.000Z"},
    {"id":386,"class":"六年忠班","seat_no":4,"name":"林恩樑\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":400,"created_at":"2025-10-09T06:40:28.000Z"},
    {"id":399,"class":"六年忠班","seat_no":4,"name":"林恩樑\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-14T00:20:29.000Z"},
    {"id":173,"class":"六年忠班","seat_no":5,"name":"李世源\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-26T03:22:28.000Z"},
    {"id":306,"class":"六年忠班","seat_no":6,"name":"楊肇榕\r","item":"朗朗英語闖關","standard":"每通過一關100","score":800,"created_at":"2025-10-09T06:12:50.000Z"},
    {"id":387,"class":"六年忠班","seat_no":6,"name":"楊肇榕\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":300,"created_at":"2025-10-09T06:40:36.000Z"},
    {"id":185,"class":"六年忠班","seat_no":7,"name":"童匯成\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:34:30.000Z"},
    {"id":388,"class":"六年忠班","seat_no":7,"name":"童匯成\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":1100,"created_at":"2025-10-09T06:40:43.000Z"},
    {"id":174,"class":"六年忠班","seat_no":8,"name":"丁聖珈\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-26T03:22:44.000Z"},
    {"id":186,"class":"六年忠班","seat_no":8,"name":"丁聖珈\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:34:36.000Z"},
    {"id":175,"class":"六年忠班","seat_no":9,"name":"張正佑\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-26T03:22:52.000Z"},
    {"id":187,"class":"六年忠班","seat_no":9,"name":"張正佑\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:34:44.000Z"},
    {"id":300,"class":"六年忠班","seat_no":9,"name":"張正佑\r","item":"家長參與","standard":"親職教育講座班親會學校活動500","score":500,"created_at":"2025-10-03T07:03:07.000Z"},
    {"id":389,"class":"六年忠班","seat_no":9,"name":"張正佑\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:40:49.000Z"},
    {"id":176,"class":"六年忠班","seat_no":11,"name":"曾璽恩\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-26T03:23:02.000Z"},
    {"id":177,"class":"六年忠班","seat_no":11,"name":"曾璽恩\r","item":"朗朗英語闖關","standard":"每通過一關","score":800,"created_at":"2025-09-26T03:23:10.000Z"},
    {"id":188,"class":"六年忠班","seat_no":11,"name":"曾璽恩\r","item":"假日營隊","standard":"每次參加假日營隊每一日可得","score":200,"created_at":"2025-09-29T23:34:53.000Z"},
    {"id":269,"class":"六年忠班","seat_no":11,"name":"曾璽恩\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:28:49.000Z"},
    {"id":270,"class":"六年忠班","seat_no":11,"name":"曾璽恩\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:28:53.000Z"},
    {"id":307,"class":"六年忠班","seat_no":11,"name":"曾璽恩\r","item":"朗朗英語闖關","standard":"每通過一關100","score":1900,"created_at":"2025-10-09T06:13:25.000Z"},
    {"id":273,"class":"六年忠班","seat_no":13,"name":"張子瀅\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:29:18.000Z"},
    {"id":274,"class":"六年忠班","seat_no":13,"name":"張子瀅\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:29:22.000Z"},
    {"id":271,"class":"六年忠班","seat_no":14,"name":"黃沛晨\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:29:01.000Z"},
    {"id":272,"class":"六年忠班","seat_no":14,"name":"黃沛晨\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:29:06.000Z"},
    {"id":390,"class":"六年忠班","seat_no":14,"name":"黃沛晨\r","item":"線上喜閱網闖關","standard":"依該書點數換算","score":100,"created_at":"2025-10-09T06:41:02.000Z"},
    {"id":265,"class":"四年忠班","seat_no":1,"name":"黃益家\r","item":"校內比賽","standard":"基本參賽100","score":100,"created_at":"2025-10-02T05:28:15.000Z"},
    {"id":266,"class":"四年忠班","seat_no":1,"name":"黃益家\r","item":"校內比賽","standard":"甲等第3名100","score":100,"created_at":"2025-10-02T05:28:19.000Z"},
    {"id":47,"class":"四年忠班","seat_no":2,"name":"梁盛發\r","item":"家長參與","standard":"親職教育講座班親會學校活動","score":500,"created_at":"2025-09-17T03:33:34.000Z"}
];

// 連接到資料庫
db.connect(err => {
    if (err) {
        console.error('❌ 連線 MySQL 失敗:', err);
        return;
    }
    console.log('✅ 已連線 MySQL');

    let importedCount = 0;
    let failedCount = 0;

    // 使用 Promise 處理非同步查詢
    const insertPoint = (point) => {
        return new Promise((resolve, reject) => {
            // 查詢 student_id
            const studentQuery = 'SELECT student_id FROM students WHERE class = ? AND seat_no = ?';
            db.query(studentQuery, [point.class, point.seat_no], (err, results) => {
                if (err) {
                    console.error(`❌ 查詢 student_id 失敗 (${point.class}, ${point.seat_no}):`, err);
                    failedCount++;
                    return resolve();
                }

                if (results.length === 0) {
                    console.error(`❌ 未找到學生 (${point.class}, ${point.seat_no})`);
                    failedCount++;
                    return resolve();
                }

                const studentId = results[0].student_id;

                // 插入或更新 points 表格
                const sql = `INSERT INTO points (id, student_id, item, standard, score, created_at)
                             VALUES (?, ?, ?, ?, ?, ?)
                             ON DUPLICATE KEY UPDATE
                             student_id = ?, item = ?, standard = ?, score = ?, created_at = ?`;
                const values = [
                    point.id,
                    studentId,
                    point.item,
                    point.standard,
                    point.score,
                    point.created_at,
                    studentId,
                    point.item,
                    point.standard,
                    point.score,
                    point.created_at
                ];

                db.query(sql, values, (err) => {
                    if (err) {
                        console.error(`❌ 插入/更新記錄失敗 (id: ${point.id}):`, err);
                        failedCount++;
                    } else {
                        importedCount++;
                    }
                    resolve();
                });
            });
        });
    };

    // 依序處理每一筆資料
    (async () => {
        for (const point of pointsData) {
            await insertPoint(point);
        }

        console.log(`✅ 成功匯入 ${importedCount} 筆資料`);
        console.log(`❌ 失敗 ${failedCount} 筆資料`);
        db.end();
    })();
});