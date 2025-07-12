const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeMq5VrWndE6OZqE4aSrpj-MQhSYp5g7OlhZCY9cy1giwPhpyiIkQGCvzFA6-Ae-cGI6ICPkfy1o4F/pub?output=csv";

const selectedChapter = sessionStorage.getItem("selectedChapter");
if (document.getElementById("chapter-name")) {
  document.getElementById("chapter-name").textContent = selectedChapter;
}

let currentQuestion = 0;
let score = 0;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;
    const chapterQuestions = data
      .filter(row => row["Chapter"] === selectedChapter)
      .map(row => ({
        text: row["Question"],
        options: [row["Option1"], row["Option2"], row["Option3"], row["Option4"]],
        answer: parseInt(row["AnswerIndex"])
      }));

    startQuiz(chapterQuestions);
  }
});

function startQuiz(questionsArray) {
  updateProgressInfo(questionsArray);
  showQuestion(questionsArray);

  function showQuestion(questions) {
    const q = questions[currentQuestion];
    const container = document.createElement('div');
    container.className = 'question-container';

    const title = document.createElement('h3');
    title.textContent = `Question ${currentQuestion + 1}: ${q.text}`;
    container.appendChild(title);

    const optionLabels = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('label');
      btn.className = 'answer';
      btn.innerHTML = `<input type="radio" name="answer" value="${i}"> <strong>${optionLabels[i]}.</strong> ${opt}`;
      container.appendChild(btn);
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit";
    submitBtn.onclick = () => {
      const selected = container.querySelector('input[name="answer"]:checked');
     if (!selected) {
  const alert = document.getElementById("alert-box");
  alert.textContent = "⚠️ Please select an answer before submitting.";
  alert.style.display = "block";

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
  return;
}


      const selectedIndex = parseInt(selected.value);
      const allOptions = container.querySelectorAll('.answer');

      allOptions.forEach((opt, i) => {
        if (i === q.answer) {
          opt.classList.add('correct');
        } else if (i === selectedIndex) {
          opt.classList.add('incorrect');
        }
      });

      if (selectedIndex === q.answer) score++;
      submitBtn.disabled = true;

      setTimeout(() => {
        container.classList.add('hidden');
        setTimeout(() => {
          container.remove();
          currentQuestion++;

          const percent = Math.round((currentQuestion / questionsArray.length) * 100);
          document.getElementById('progress-bar').style.width = `${percent}%`;
          updateProgressInfo(questionsArray);

          if (currentQuestion < questionsArray.length) {
            showQuestion(questionsArray);
          } else {
            showFinalResult(questionsArray);
          }
        }, 500);
      }, 1000);
    };

    container.appendChild(submitBtn);
    document.getElementById('quiz').appendChild(container);
  }
}

function updateProgressInfo(questionsArray) {
  const answered = currentQuestion;
  const total = questionsArray.length;
  const remaining = total - answered;
  const percent = Math.round((answered / total) * 100);
  document.getElementById('chapter-progress-info').textContent =
    `Answered: ${answered} / ${total} | Remaining: ${remaining} | Completed: ${percent}%`;
}

function showFinalResult(questionsArray) {
  const scoreRatio = score / questionsArray.length;
  let message = "";

    document.getElementById("back-btn").style.display = "inline-block";
document.getElementById("restart-btn").style.display = "inline-block";

document.getElementById("back-btn").onclick = () => {
  window.location.href = "index.html";
};

document.getElementById("restart-btn").onclick = () => {
  currentQuestion = 0;
  score = 0;
  document.getElementById("quiz").innerHTML = "";
  document.getElementById("result").style.display = "none";
  document.getElementById("back-btn").style.display = "none";
  document.getElementById("restart-btn").style.display = "none";
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("share-btn").style.display = "none";
  startQuiz(questionsArray);
};

  
document.getElementById("share-btn").style.display = "inline-block";

document.getElementById("share-btn").onclick = () => {
  const shareText = `I just scored ${score} out of ${questionsArray.length} in the "${selectedChapter}" quiz! 🧠🎉`;
  
  if (navigator.share) {
    navigator.share({
      title: "My Quiz Result",
      text: shareText,
      url: window.location.href
    }).then(() => {
      console.log("Score shared successfully");
    }).catch(err => {
      console.log("Sharing failed:", err);
    });
  } else {
    alert("Sharing isn't supported on your device. You can copy and share: \n\n" + shareText);
  }
};
  const badResults = [
    "Don't worry, every expert was once a beginner 💪",
    "Mistakes are proof you're trying 💡",
    "Your journey is just beginning — don't stop now 🚶‍♂️",
    "Even the best stumble — it's how they rise that counts 🔁",
    "Failure is not the opposite of success, it's part of it 🌱",
    "Your score doesn’t define your worth 💖",
    "Keep learning — progress is better than perfection 📘",
    "Don't lose heart, gain hunger 🔥",
    "This quiz is just one page in your success story 📖",
    "Rome wasn't built in a day — neither is mastery 🏗️"
  ];

  const goodResults = [
    "Nice work! You're building momentum 🚴",
    "Almost there! Just a few steps from excellence 👣",
    "You're lighting up those neurons 🧠✨",
    "Solid result! Now imagine the next level 🧗",
    "Great effort — your learning curve is climbing 📈",
    "You're close to brilliance 🔥",
    "You’ve got promise — and progress 💫",
    "This was smart effort — keep showing up 💼",
    "You're on the rise — keep pushing! 🌤️",
    "Knowledge is compounding — keep investing 🪙"
  ];

  const greatResults = [
    "Woohoo! You’re officially a quiz boss 🎉🧠",
    "Top-tier performance — applause from the clouds 👏☁️",
    "Outstanding — you've aced it like a pro 🚀",
    "That score is glowing — so are you 💡💖",
    "Legendary memory, sharp reflexes — you're elite 🧬",
    "You didn’t take the quiz — you owned it 🏰",
    "Peak performance unlocked — welcome to the podium 🥇",
    "Superstar status confirmed ✨🌟",
    "You crushed it! Like a genius on roller skates 🛼🧠",
    "Knowledge beast mode: activated 🐉"
  ];

  if (scoreRatio < 0.4) {
    message = badResults[Math.floor(Math.random() * badResults.length)];
  } else if (scoreRatio < 0.8) {
    message = goodResults[Math.floor(Math.random() * goodResults.length)];
  } else {
    message = greatResults[Math.floor(Math.random() * greatResults.length)];
  }

  const celebration = `
    <div style="margin-top: 20px; font-size: 24px;">
      🎊🎉 Congratulations! 🎉🎊<br>
      👏👏 You're amazing 👏👏
    </div>
  `;

  document.getElementById('result').style.display = 'block';
  document.getElementById('result').innerHTML = `
    <div>Your score: ${score} / ${questionsArray.length}</div>
    <div style="margin-top: 10px;">${message}</div>
    ${celebration}
  `;

  // Final progress update
  updateProgressInfo(questionsArray);
}
