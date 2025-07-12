const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeMq5VrWndE6OZqE4aSrpj-MQhSYp5g7OlhZCY9cy1giwPhpyiIkQGCvzFA6-Ae-cGI6ICPkfy1o4F/pub?output=csv";

let currentQuestion = 0;
let score = 0;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;
    const questions = data.map(row => ({
      text: row["Question"],
      options: [row["Option1"], row["Option2"], row["Option3"], row["Option4"]],
      answer: parseInt(row["AnswerIndex"])
    }));
    startQuiz(questions);
  }
});

function startQuiz(questionsArray) {
  showQuestion(questionsArray);

  function showQuestion(questions) {
    const q = questions[currentQuestion];

    const container = document.createElement('div');
    container.className = 'question-container';

    // 🧠 Show question number and text
    const title = document.createElement('h3');
    title.textContent = `Question ${currentQuestion + 1}: ${q.text}`;
    container.appendChild(title);

    // 🅰️ Label options as A, B, C, D
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

          // ✅ Update progress bar and percentage
          const percent = Math.round((currentQuestion / questionsArray.length) * 100);
          document.getElementById('progress-bar').style.width = `${percent}%`;
          document.getElementById('percent-display').textContent = `Completed: ${percent}%`;

          if (currentQuestion < questionsArray.length) {
            showQuestion(questionsArray);
          } else {
            // 🎯 Show final score only at end
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
