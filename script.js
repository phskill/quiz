const API_KEY = "AIzaSyCp7TU65xjCe-es224kMg2CLkI1p9lOv1M";
const SPREADSHEET_ID = "1ORYvcif7ABs-TyhfL_Eju9kMcYpbBbaOo51TP53zvwg";
const RANGE = "quiz-data!A2:F"; // Skip header row

async function fetchQuizData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.values.map(row => ({
    text: row[0],
    options: row.slice(1, 5),
    answer: parseInt(row[5])
  }));
}

let currentQuestion = 0;
let score = 0;

fetchQuizData().then(questions => {
  showQuestion(questions);

  function showQuestion(questionsArray) {
    const q = questionsArray[currentQuestion];
    const container = document.createElement('div');
    container.className = 'question-container';

    const title = document.createElement('h3');
    title.textContent = q.text;
    container.appendChild(title);

    q.options.forEach((opt, i) => {
      const btn = document.createElement('label');
      btn.className = 'answer';
      btn.innerHTML = `<input type="radio" name="answer" value="${i}"> ${opt}`;
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
          if (currentQuestion < questionsArray.length) {
            showQuestion(questionsArray);
          } else {
            document.getElementById('result').textContent =
              `Your score: ${score} / ${questionsArray.length}`;
          }
        }, 500);
      }, 1000);
    };

    container.appendChild(submitBtn);
    document.getElementById('quiz').appendChild(container);
  }
});
