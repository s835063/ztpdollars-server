// classAllRank.js

const classOrder = [
  "一年忠班", "二年忠班", "三年忠班", "三年孝班",
  "四年忠班", "五年忠班", "五年孝班",
  "六年忠班", "六年孝班"
];

const classColors = {
  "一年忠班": "#7EB426",
  "二年忠班": "#f0e055ff",
  "三年忠班": "#FFF3E0",
  "三年孝班": "#FCE4EC",
  "四年忠班": "#f084cfff",
  "五年忠班": "#f3e86aff",
  "五年孝班": "#66f1d3ff",
  "六年忠班": "#f39d93ff",
  "六年孝班": "#a27ddaff"
};

// 🔤 將姓名的第二個字替換為 "O"
function maskName(name) {
  if (typeof name !== "string" || name.length < 2) return name;
  const chars = [...name];
  chars[1] = "O";
  return chars.join("");
}

// 主函式：載入「各班所有學生排行榜」
async function fetchClassAllRank() {
  try {
    const res = await fetch('/api/points'); // 後端回傳全校積分資料
    const data = await res.json();

    // 分班統計
    const grouped = {};
    data.forEach(d => {
      if (!grouped[d.class]) grouped[d.class] = {};
      if (!grouped[d.class][d.name]) grouped[d.class][d.name] = 0;
      grouped[d.class][d.name] += d.score;
    });

    const grid = document.getElementById("classGridAll");
    grid.innerHTML = "";

    // 🔥 讀取 localStorage 中 HOT 資料
    let hotData = JSON.parse(localStorage.getItem("hotClassAll")) || {};
    const now = Date.now();

    // 依指定班級順序顯示
    classOrder.forEach(cls => {
      const students = Object.entries(grouped[cls] || {})
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);

      // 建立班級卡片
      const card = document.createElement("div");
      card.className = "class-card";

      let rows = students.map((s, i) => {
        let rowClass = '';
        let medal = '';

        if (i === 0) { rowClass = 'gold'; medal = '🥇'; }
        else if (i === 1) { rowClass = 'silver'; medal = '🥈'; }
        else if (i === 2) { rowClass = 'bronze'; medal = '🥉'; }

        // 🔥 HOT 標籤邏輯
        const key = `${cls}-${s.name}`;
        let hotMark = "";

        if (i < 6) { // 僅前6名考慮HOT
          if (!hotData[key]) {
            hotData[key] = now; // 新進榜
            hotMark = '<span class="hot">🔥HOT</span>';
          } else {
            const diffDays = (now - hotData[key]) / (1000 * 60 * 60 * 24);
            if (diffDays <= 7) hotMark = '<span class="hot">🔥HOT</span>';
          }
        }

        return `
          <tr class="${rowClass}">
            <td>${medal || i + 1}</td>
            <td>${maskName(s.name)} ${hotMark}</td>
            <td>${s.score}</td>
          </tr>
        `;
      }).join("");

      // 組合卡片內容
      card.innerHTML = `
        <div class="class-title" style="background:${classColors[cls] || '#ddd'}">
          ${cls}
        </div>
        <table>
          <tr><th>名次</th><th>姓名</th><th>總分</th></tr>
          ${rows || `<tr><td colspan="3">尚無資料</td></tr>`}
        </table>
      `;
      grid.appendChild(card);
    });

    // 更新 localStorage
    localStorage.setItem("hotClassAll", JSON.stringify(hotData));

  } catch (err) {
    console.error("🚨 載入各班所有學生排行榜失敗:", err);
  }
}

// 初始化呼叫
fetchClassAllRank();
