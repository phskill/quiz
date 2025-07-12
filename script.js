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
      if (!selected) return;

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
          document.getElementById('percent-display').textContent = `Completed: ${percent}%`;

          updateProgressInfo(questionsArray);

          if (currentQuestion < questionsArray.length) {
            showQuestion(questionsArray);
          } else {
            document.getElementById('result').style.display = 'block';
            document.getElementById('result').textContent = `Your score: ${score} / ${questionsArray.length}`;
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
