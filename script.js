const currentUser = sessionStorage.getItem("userId");
const selectedChapter = sessionStorage.getItem("selectedChapter");
if (!currentUser || !selectedChapter) {
  window.location.href = "login.html";
}

document.getElementById("chapter-name").textContent = `📘 ${selectedChapter}`;
let questionsArray = [];
let currentQuestion = 0;
let score = 0;

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeMq5VrWndE6OZqE4aSrpj-MQhSYp5g7OlhZCY9cy1giwPhpyiIkQGCvzFA6-Ae-cGI6ICPkfy1o4F/pub?output=csv";
const webAppUrl = "https://script.google.com/macros/s/AKfycbyayo8phYFtrOFXsP_ZD28OgqRbXUEw9kJAGwRcoIfKt6Tyaj5DNy17oSRzwCAV4elqBA/exec";

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    questionsArray = results.data.filter(q => q["Chapter"] === selectedChapter);
    displayQuestion();
  }
});

function displayQuestion() {
  const q = questionsArray[currentQuestion];
  document.getElementById("question-counter").textContent = `Question ${currentQuestion + 1} of ${questionsArray.length}`;
  document.getElementById("question-text").textContent = q["Question"];

  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";

  const options = [q["Option1"], q["Option2"], q["Option3"], q["Option4"]];
  options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.classList.add("option-item");
    li.onclick = () => {
      document.querySelectorAll(".option-item").forEach(el => el.classList.remove("selected"));
      li.classList.add("selected");
      questionsArray[currentQuestion].userChoice = index;
      document.getElementById("next-btn").disabled = false;
    };
    optionsList.appendChild(li);
  });

  document.getElementById("next-btn").disabled = true;
}

document.getElementById("next-btn").onclick = () => {
  const q = questionsArray[currentQuestion];
  const chosen = q.userChoice;
  const correct = parseInt(q["Answer"]);

  if (chosen === correct) score++;

  currentQuestion++;
  if (currentQuestion < questionsArray.length) {
    displayQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";
  document.getElementById("score-result").textContent = `Your Score: ${score} / ${questionsArray.length}`;

  const wrongAnswers = questionsArray.filter(q => q.userChoice !== parseInt(q["Answer"]));
  const totalScore = `${score} / ${questionsArray.length}`;

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
    // Log perfect score with no mistakes
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
