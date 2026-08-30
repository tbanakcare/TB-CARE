const menu=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav-links");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const questions=[
  {
    q:"Apa itu TB (Tuberkulosis) pada anak?",
    options:[
      "Penyakit yang hanya menyerang kulit",
      "Penyakit menular yang paling sering menyerang paru-paru dan dapat mengenai organ lain",
      "Alergi biasa",
      "Penyakit karena kekurangan vitamin"
    ],
    correct:1
  },
  {
    q:"Bagaimana kuman TB dapat menyebar?",
    options:[
      "Melalui udara saat penderita TB batuk atau bersin",
      "Karena sering bermain di luar",
      "Karena makan makanan pedas",
      "Karena kurang tidur"
    ],
    correct:0
  },
  {
    q:"Manakah tanda yang perlu diperhatikan pada anak?",
    options:[
      "Rambut tumbuh cepat",
      "Kuku memanjang",
      "Berat badan sulit naik atau menurun",
      "Sering meminta mainan"
    ],
    correct:2
  },
  {
    q:"Apa yang sebaiknya dilakukan selama pengobatan TB?",
    options:[
      "Menghentikan obat saat anak terlihat sehat",
      "Minum obat teratur sesuai anjuran tenaga kesehatan",
      "Mengubah dosis sendiri",
      "Minum obat hanya saat demam"
    ],
    correct:1
  },
  {
    q:"Apa salah satu cara membantu mencegah penularan TB di rumah?",
    options:[
      "Menutup semua jendela",
      "Membuat kamar lebih lembap",
      "Membiarkan asap rokok di dalam rumah",
      "Membuka jendela agar sirkulasi udara baik"
    ],
    correct:3
  }
];

let index=0, score=0, answered=false;
const questionEl=document.getElementById("question");
const answersEl=document.getElementById("answers");
const feedbackEl=document.getElementById("feedback");
const nextBtn=document.getElementById("nextQuestion");
const progressLabel=document.getElementById("progressLabel");
const scoreLabel=document.getElementById("scoreLabel");
const progressBar=document.getElementById("progressBar");

function renderQuestion(){
  if(index>=questions.length){
    questionEl.textContent="Quiz selesai!";
    answersEl.innerHTML=`<div class="final-score">
      <span>Skor akhir kamu</span>
      <strong>${score} / ${questions.length}</strong>
      <p>${score===5?"Hebat! Semua jawaban kamu benar 🎉":score>=3?"Bagus! Terus belajar ya 🌟":"Yuk baca kembali materinya lalu coba lagi 💜"}</p>
    </div>`;
    feedbackEl.className="feedback";
    feedbackEl.style.display="none";
    nextBtn.textContent="Ulangi Quiz";
    nextBtn.disabled=false;
    progressLabel.textContent="Selesai";
    scoreLabel.textContent=`Skor: ${score}`;
    progressBar.style.width="100%";
    return;
  }

  const item=questions[index];
  answered=false;
  questionEl.textContent=item.q;
  progressLabel.textContent=`Soal ${index+1} dari ${questions.length}`;
  scoreLabel.textContent=`Skor: ${score}`;
  progressBar.style.width=`${((index+1)/questions.length)*100}%`;
  feedbackEl.className="feedback";
  feedbackEl.style.display="none";
  feedbackEl.textContent="";
  nextBtn.disabled=true;
  nextBtn.textContent=index===questions.length-1?"Lihat Skor →":"Selanjutnya →";

  answersEl.innerHTML=item.options.map((opt,i)=>
    `<button class="answer" data-index="${i}">${String.fromCharCode(65+i)}. ${opt}</button>`
  ).join("");

  document.querySelectorAll(".answer").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(answered)return;
      answered=true;

      const picked=Number(btn.dataset.index);
      const isCorrect=picked===item.correct;
      if(isCorrect){
        score++;
        btn.classList.add("correct");
        feedbackEl.textContent="Benar ✅";
        feedbackEl.className="feedback good";
      }else{
        btn.classList.add("wrong");
        feedbackEl.textContent="Kurang tepat ❌";
        feedbackEl.className="feedback bad";
      }

      document.querySelectorAll(".answer").forEach(b=>b.classList.add("locked"));
      scoreLabel.textContent=`Skor: ${score}`;
      nextBtn.disabled=false;
    });
  });
}

nextBtn.addEventListener("click",()=>{
  if(index>=questions.length){
    index=0;
    score=0;
  }else{
    index++;
  }
  renderQuestion();
});
renderQuestion();

const KEY="tbAnakCareQuizFinalLogs";
function getLogs(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
function saveLogs(logs){localStorage.setItem(KEY,JSON.stringify(logs))}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}

function renderLogs(){
  const logs=getLogs(), body=document.getElementById("medicineBody");
  if(!body)return;
  body.innerHTML=logs.length?logs.map((x,i)=>{
    const cls=x.status==="Sudah diminum"?"status-done":x.status==="Terlewat"?"status-missed":"status-wait";
    return `<tr><td>${esc(x.tanggal)}</td><td>${esc(x.waktu||"-")}</td><td>${esc(x.obat)}</td><td><span class="status-pill ${cls}">${esc(x.status)}</span></td><td>${esc(x.catatan||"-")}</td><td><button class="delete-btn" data-delete="${i}">Hapus</button></td></tr>`;
  }).join(""):`<tr><td colspan="6" style="text-align:center;padding:24px;color:#718190">Belum ada catatan.</td></tr>`;

  const done=logs.filter(x=>x.status==="Sudah diminum").length;
  document.getElementById("total").textContent=logs.length;
  document.getElementById("done").textContent=done;
  document.getElementById("pending").textContent=logs.length-done;

  document.querySelectorAll("[data-delete]").forEach(btn=>btn.addEventListener("click",()=>{
    const logs=getLogs();
    logs.splice(Number(btn.dataset.delete),1);
    saveLogs(logs);
    renderLogs();
  }));
}

document.getElementById("addMedicine")?.addEventListener("click",()=>{
  const obat=document.getElementById("obat").value.trim();
  const tanggal=document.getElementById("tanggal").value;
  const waktu=document.getElementById("waktu").value;
  const status=document.getElementById("status").value;
  const catatan=document.getElementById("catatanText").value.trim();

  if(!obat||!tanggal){
    alert("Isi nama obat dan tanggal terlebih dahulu.");
    return;
  }

  const logs=getLogs();
  logs.unshift({obat,tanggal,waktu,status,catatan});
  saveLogs(logs);

  document.getElementById("obat").value="";
  document.getElementById("catatanText").value="";
  renderLogs();
});

document.addEventListener("DOMContentLoaded",()=>{
  const date=document.getElementById("tanggal");
  if(date&&!date.value)date.value=new Date().toISOString().slice(0,10);
  renderLogs();
});