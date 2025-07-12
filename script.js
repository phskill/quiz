const currentUser = sessionStorage.getItem("userId");
const selectedChapter = sessionStorage.getItem("selectedChapter");
if (!currentUser || !selectedChapter) window.location.href = "login.html";

document.getElementById("chapter-name").textContent = `📘 ${selectedChapter}`;
const webAppUrl = "https://script.google.com/macros/s/AKfycbyayo8phYFtrOFXsP_ZD28OgqRbXUEw9kJAGwRcoIfKt6Tyaj5DNy17oSRzwCAV4elqBA/exec";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeMq5VrWndE6OZqE4aSrpj-MQhSYp5g7OlhZCY9cy1giwPhpyiIkQGCvzFA6-Ae-cGI6ICPkfy1o4F/pub?output=csv";

let questionsArray = [];
let currentQuestion = 0;
let score = 0;
let timer;
let countdown = 15;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    questionsArray = results.data.filter(q => q["Chapter"] === selectedChapter);
    displayQuestion();
  }
});

function displayQuestion() {
  resetTimer();

  const q = questionsArray[currentQuestion];
  document.getElementById("question-counter").textContent = `Question ${currentQuestion + 1} of ${questionsArray.length}`;
  document.getElementById("question-text").textContent = q["Question"];
  document.getElementById("next-btn").disabled = true;

  const correctIndex = parseInt(q["Answer"]); // correct option index is 1-based
  const allOptions = [
    { text: q["Option1"], isCorrect: correctIndex === 1 },
    { text: q["Option2"], isCorrect: correctIndex === 2 },
    { text: q["Option3"], isCorrect: correctIndex === 3 },
    { text: q["Option4"], isCorrect: correctIndex === 4 }
  ];

  const shuffled = allOptions.sort(() => Math.random() - 0.5);
  questionsArray[currentQuestion].shuffledOptions = shuffled;

  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";

  shuffled.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt.text;
    li.classList.add("option-item");
    li.onclick = () => {
      document.querySelectorAll(".option-item").forEach(el => el.classList.remove("selected"));
      li.classList.add("selected");
      questionsArray[currentQuestion].userChoice = index;
      document.getElementById("next-btn").disabled = false;
      clearInterval(timer);
    };
    optionsList.appendChild(li);
  });

  startTimer();
}

document.getElementById("next-btn").onclick = () => {
  handleAnswer();
  nextQuestion();
};

function handleAnswer() {
  const q = questionsArray[currentQuestion];
  const chosen = q.userChoice;
  const isCorrect = q.shuffledOptions[chosen]?.isCorrect;
  if (isCorrect) score++;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questionsArray.length) {
    displayQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";
  document.getElementById("score-result").textContent = `Your Score: ${score} / ${questionsArray.length}`;
  const totalScore = `${score} / ${questionsArray.length}`;

  const wrongAnswers = questionsArray.filter(q => !q.shuffledOptions[q.userChoice]?.isCorrect);
  wrongAnswers.forEach(q => {
    const chosenIndex = q.userChoice;
    const chosenText = q.shuffledOptions[chosenIndex]?.text || "";
    const correctText = q.shuffledOptions.find(opt => opt.isCorrect)?.text || "";

    fetch(webAppUrl, {
      method: "POST",
      body: JSON.stringify({
        mode: "quizResult",
        user: currentUser,
        chapter: selectedChapter,
        score: totalScore,
        wrongQuestion: q["Question"],
        chosenAnswer: chosenText,
        correctAnswer: correctText
      }),
      headers: { "Content-Type": "application/json" }
    });
  });

  if (wrongAnswers.length === 0) {
    fetch(webAppUrl, {
      method: "POST",
      body: JSON.stringify({
        mode: "quizResult",
        user: currentUser,
        chapter: selectedChapter,
        score: totalScore,
        wrongQuestion: "",
        chosenAnswer: "",
        correctAnswer: ""
      }),
      headers: { "Content-Type": "application/json" }
    });
  }
}

// ⏱ Timer logic
function startTimer() {
  countdown = 15;
  document.getElementById("timer-box").textContent = `⏳ Time Left: ${countdown}`;
  timer = setInterval(() => {
    countdown--;
    document.getElementById("timer-box").textContent = `⏳ Time Left: ${countdown}`;
    if (countdown <= 0) {
      clearInterval(timer);
      questionsArray[currentQuestion].userChoice = null;
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  countdown = 15;
}
