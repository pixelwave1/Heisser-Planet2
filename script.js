let username = "";
let score = 0;
let timer;
let timeLeft = 10;
let currentQuestion = 0;

const questions = {
  leicht: [
    {q:"Klimawandel betrifft Menschenrechte.", a:true},
    {q:"Sauberes Wasser ist kein Menschenrecht.", a:false}
  ],
  mittel: [
    {q:"Dürren können das Recht auf Nahrung verletzen.", a:true},
    {q:"Klimawandel hat nichts mit Gesundheit zu tun.", a:false}
  ],
  schwer: [
    {q:"Der Klimawandel verstärkt soziale Ungleichheit.", a:true},
    {q:"Nur Tiere sind vom Klimawandel betroffen.", a:false}
  ]
};

let gameQuestions = [];

function startApp(){
  username = document.getElementById("usernameInput").value;
  if(username==="") return alert("Bitte Name eingeben!");
  localStorage.setItem("username", username);
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("welcomeText").innerText = "Willkommen, " + username + " 👋";
  loadSettings();
  generateQR();
}

function changeTheme(){
  let theme = document.getElementById("themeSelect").value;
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}

function loadSettings(){
  let theme = localStorage.getItem("theme");
  let dark = localStorage.getItem("dark");
  if(theme){
    document.body.classList.add(theme);
    document.getElementById("themeSelect").value = theme;
  }
  if(dark==="true") document.body.classList.add("dark");
}

function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

function startGame(){
  score = 0;
  currentQuestion = 0;
  let level = document.getElementById("levelSelect").value;
  gameQuestions = questions[level];
  nextQuestion();
}

function nextQuestion(){
  if(currentQuestion >= gameQuestions.length){
    saveHighscore();
    alert("Spiel beendet!");
    return;
  }
  document.getElementById("question").innerText = gameQuestions[currentQuestion].q;
  timeLeft = 10;
  document.getElementById("timer").innerText = timeLeft;
  clearInterval(timer);
  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if(timeLeft<=0){
      clearInterval(timer);
      currentQuestion++;
      nextQuestion();
    }
  },1000);
}

function answer(ans){
  clearInterval(timer);
  if(ans === gameQuestions[currentQuestion].a){
    score++;
    playSound(true);
  } else {
    playSound(false);
  }
  document.getElementById("score").innerText = score;
  currentQuestion++;
  nextQuestion();
}

function newRound(){
  startGame();
}

function playSound(correct){
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = correct ? 600 : 200;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(()=>osc.stop(),200);
}

function saveHighscore(){
  let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  highscores.push({name:username, score:score});
  highscores.sort((a,b)=>b.score-a.score);
  localStorage.setItem("highscores", JSON.stringify(highscores));
  displayHighscores();
}

function displayHighscores(){
  let list = document.getElementById("highscoreList");
  list.innerHTML="";
  let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  highscores.forEach(h=>{
    let li = document.createElement("li");
    li.textContent = h.name + " - " + h.score;
    list.appendChild(li);
  });
}

function vote(answer){
  document.getElementById("voteResult").innerText = "Du hast gewählt: " + answer;
}

function generateQR(){
  let url = window.location.href;
  document.getElementById("qrCode").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(url);
}

displayHighscores();
