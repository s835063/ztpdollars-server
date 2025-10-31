// main.js

const pointsTableBody = document.querySelector('#pointsTable tbody');
const studentSelect = document.querySelector('#studentSelect');
const classSelect = document.querySelector('#classSelect');
const itemSelect = document.querySelector('#itemSelect');
const standardSelect = document.querySelector('#standardSelect');
const scoreInput = document.querySelector('#scoreInput');
const addButton = document.querySelector('#addButton');
const top5Button = document.querySelector('#top5Button');
const top30Button = document.querySelector('#top30Button');
const top30Table = document.querySelector('#top30Table');
const top30Tbody = top30Table.querySelector('tbody');

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "16px";
    toast.style.color = "#fff";
    toast.style.zIndex = "1000";
    toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    if (type === "success") toast.style.backgroundColor = "#4CAF50";
    else if (type === "error") toast.style.backgroundColor = "#F44336";
    else toast.style.backgroundColor = "#2196F3";
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "1"; }, 100);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 500); }, 3000);
}

function normalizeClassName(name) {
    return (name || "").trim().replace(/\s+/g, "").replace(/\r|\n/g, "")
        .replace(/[^\u4e00-\u9fa5\u3400-\u4dbf\u2e80-\u2eff\u3000-\u303f\w]/g, "");
}

const classOrder = ["一年忠班","二年忠班","三年忠班","三年孝班","四年忠班","五年忠班","五年孝班","六年忠班","六年孝班","測試"];
const classColors = {
    "一年忠班": "#7EB426","二年忠班": "#f0e055ff","三年忠班": "#FFF3E0","三年孝班": "#FCE4EC",
    "四年忠班": "#f084cfff","五年忠班": "#f3e86aff","五年孝班": "#66f1d3ff","六年忠班": "#f39d93ff","六年孝班": "#a27ddaff"
};
const classIndex = classOrder.reduce((acc, cls, idx) => { acc[cls] = idx; return acc; }, {});

let pointsData = [];
let studentsData = [];

const itemStandardOptions = {
    "線上喜閱網闖關": ["依該書點數換算"],
    "朗朗英語闖關": ["每通過一關100"],
    "代表學校參加校外比賽": ["基本參賽500","佳作入選200","甲等第3名300","優選第2名500","特優第1名1000"],
    "家長參與": ["親職教育講座班親會學校活動500"],
    "中壇榮譽卡": ["每一階段獲得榮譽卡500"],
    "游泳認證": ["通過一個等級測驗200"],
    "假日營隊": ["每次參加假日營隊每一日可得200"],
    "體適能檢測": ["金牌1000","銀牌500","銅牌300"],
    "定期評量成績": ["特優500","進步獎300"],
    "校內比賽": ["基本參賽100","甲等第3名100","優選第2名300","特優第1名500"],
    "模範生": ["各班模範生含市模範生1000"],
    "客語認證": ["基本參賽200", "基礎級100", "初級500", "中級800", "中高級1000"],
    "其他表現": ["特殊表現好人好事200"],
};

// 取得標準分數
function getScoreFromStandard(standard){
    const match = standard.match(/\d+/);
    return match ? Number(match[0]) : 0;
}

function initClassSelect() {
    fetch('/api/students')
        .then(res=>res.json())
        .then(data=>{
            studentsData = data.map(s=>({ ...s, class: normalizeClassName(s.class), name: (s.name||"").trim() }));
            classOrder.forEach(cls=>{
                if(studentsData.some(s=>s.class===cls)){
                    const option = document.createElement('option');
                    option.value = cls; option.textContent = cls;
                    classSelect.appendChild(option);
                }
            });
        });
}

function updateStudentSelect() {
    const selectedClass = classSelect.value;
    studentSelect.innerHTML = '<option value="">選擇學生</option>';
    studentsData.filter(s=>s.class===selectedClass).sort((a,b)=>a.seat_no-b.seat_no).forEach(s=>{
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = `${s.seat_no}號 ${s.name}`;
        studentSelect.appendChild(option);
    });
}

function initItemStandard() {
    Object.keys(itemStandardOptions).forEach(item=>{
        const option = document.createElement('option');
        option.value = item; option.textContent = item;
        itemSelect.appendChild(option);
    });
}

function updateStandardSelect() {
    const selectedItem = itemSelect.value;
    standardSelect.innerHTML = '';
    itemStandardOptions[selectedItem].forEach(std=>{
        const option = document.createElement('option');
        option.value = std; option.textContent = std;
        standardSelect.appendChild(option);
    });
    // 自動填入分數
    if(standardSelect.value){
        scoreInput.value = getScoreFromStandard(standardSelect.value);
    }
}

// 選擇標準時自動更新分數
standardSelect.addEventListener('change',()=>{
    if(standardSelect.value){
        scoreInput.value = getScoreFromStandard(standardSelect.value);
    }
});

function fetchPoints() {
    fetch('/api/points')
        .then(res=>res.json())
        .then(data=>{
            pointsData = data.map(p=>({ ...p, class: normalizeClassName(p.class), name: (p.name||"").trim() }));
            renderTable();
        });
}

function calculateTotalPoints() {
    const totals = {};
    pointsData.forEach(p=>{
        if(!totals[p.name]) totals[p.name]=0;
        totals[p.name]+=p.score;
    });
    return totals;
}

function renderTable(filteredData=pointsData){
    pointsTableBody.innerHTML='';
    const totals = calculateTotalPoints();
    const sortedData = [...filteredData].sort((a,b)=>{
        const classA = normalizeClassName(a.class);
        const classB = normalizeClassName(b.class);
        if(!(classA in classIndex)||!(classB in classIndex)) return classA.localeCompare(classB,'zh-Hant');
        const classDiff = classIndex[classA]-classIndex[classB];
        if(classDiff!==0) return classDiff;
        return a.seat_no-b.seat_no;
    });

    let lastClass = null;
    sortedData.forEach(row=>{
        const normalizedClass = normalizeClassName(row.class);
        if(normalizedClass!==lastClass){
            const colorRow = document.createElement("tr");
            colorRow.style.backgroundColor = classColors[normalizedClass] || "#FFF";
            colorRow.innerHTML=`<td colspan="9" style="font-weight:bold;">${normalizedClass}</td>`;
            pointsTableBody.appendChild(colorRow);

            const headerRow = document.createElement("tr");
            headerRow.innerHTML=`<th>集點日期</th><th>班級</th><th>座號</th><th>姓名</th><th>項目</th><th>標準</th><th>點數</th><th>所有點數</th><th>操作</th>`;
            pointsTableBody.appendChild(headerRow);

            lastClass = normalizedClass;
        }

        const tr = document.createElement('tr');
        tr.innerHTML=`
            <td>${row.created_at ? new Date(row.created_at).toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'}) : ''}</td>
            <td>${normalizedClass}</td>
            <td>${row.seat_no||''}</td>
            <td>${row.name||''}</td>
            <td>${row.item||''}</td>
            <td>${row.standard||''}</td>
            <td>${row.score||''}</td>
            <td>${totals[row.name]||row.score}</td>
            <td><button class="deleteBtn" data-id="${row.id}">刪除</button></td>`;
        pointsTableBody.appendChild(tr);
    });

    document.querySelectorAll('.deleteBtn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const id = btn.getAttribute('data-id');
            fetch(`/api/points/${id}`,{method:'DELETE'})
            .then(res=>res.json())
            .then(()=>{ showToast("刪除成功！","success"); fetchPoints(); })
            .catch(err=>{ console.error(err); showToast("刪除失敗！","error"); });
        });
    });
}

// 新增集點
addButton.addEventListener('click',()=>{
    const studentId = studentSelect.value;
    const item = itemSelect.value;
    const standard = standardSelect.value;
    let score = Number(scoreInput.value);

    if(!studentId || !item || !standard){ 
        showToast("⚠ 請完整填寫資料","error"); 
        return; 
    }
    if(isNaN(score)){ 
        showToast("⚠ 點數格式錯誤","error"); 
        return; 
    }

    fetch('/api/points',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ 
            student_id: studentId,
            item,
            standard,
            score
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.error) throw new Error(data.error);
        fetchPoints();
        scoreInput.value='';
        showToast("✅ 新增資料成功！","success");
    })
    .catch(err=>{
        console.error(err);
        showToast("❌ 新增失敗！"+(err.message||""),"error");
    });
});

// 前5名
top5Button.addEventListener('click',()=>{
    const totals = calculateTotalPoints();
    const sorted = Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,5);
    showToast(sorted.map(s=>`${s[0]}：${s[1]}`).join('\n'),"info");
});

// 前30名
top30Button.addEventListener('click',()=>{
    fetch('/api/top30').then(res=>res.json()).then(data=>{
        top30Tbody.innerHTML='';
        data.forEach((s,index)=>{
            let medal="";
            if(index===0) medal="🥇 ";
            else if(index===1) medal="🥈 ";
            else if(index===2) medal="🥉 ";
            const tr=document.createElement('tr');
            tr.innerHTML=`
                <td>${medal}${index+1}</td>
                <td>${s.class}</td>
                <td>${s.seat_no}</td>
                <td>${s.name}</td>
                <td>${s.total_score}</td>`;
            top30Tbody.appendChild(tr);
        });
        top30Table.style.display='table';
    });
});

classSelect.addEventListener('change',updateStudentSelect);
itemSelect.addEventListener('change',updateStandardSelect);

initClassSelect();
initItemStandard();
fetchPoints();
