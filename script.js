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
    questionsArray = results.data.filter(row => row["Chapter"] === selectedChapter);
    displayQuestion();
  }
});

function displayQuestion() {
  resetTimer();
  const q = questionsArray[currentQuestion];
  document.getElementById("question-counter").textContent = `Question ${currentQuestion + 1} of ${questionsArray.length}`;
  document.getElementById("question-text").textContent = q["Question"];
  document.getElementById("next-btn").disabled = true;

  const options = [q["Option1"], q["Option2"], q["Option3"], q["Option4"]];
  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";

  options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
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
  const correct = parseInt(q["Answer"]);
  if (chosen === correct) score++;
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
  const wrongAnswers = questionsArray.filter(q => q.userChoice !== parseInt(q["Answer"]));

  if (wrongAnswers.length > 0) {
    wrongAnswers.forEach(q => {
      const chosen = q.userChoice;
      const correct = parseInt(q["Answer"]);
      fetch(webAppUrl, {
        method: "POST",
        body: JSON.stringify({
          mode: "quizResult",
          user: currentUser,
          chapter: selectedChapter,
          score: totalScore,
          wrongQuestion: q["Question"],
          chosenAnswer: q["Option" + (chosen + 1)],
          correctAnswer: q["Option" + (correct + 1)]
        }),
        headers: { "Content-Type": "application/json" }
      });
    });
  } else {
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

// ⏱ Timer Logic
function startTimer() {
  countdown = 15;
  document.getElementById("timer-box").textContent = `⏳ Time Left: ${countdown}`;
  timer = setInterval(() => {
    countdown--;
    document.getElementById("timer-box").textContent = `⏳ Time Left: ${countdown}`;
    if (countdown <= 0) {
      clearInterval(timer);
      questionsArray[currentQuestion].userChoice = null; // no answer
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  countdown = 15;
}
