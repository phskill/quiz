const questions = [
  {
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: 2
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1
  },
  {
    text: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "Leo Tolstoy", "William Shakespeare", "Mark Twain"],
    answer: 2
  }
];

let currentQuestion = 0;
let score = 0;

function showQuestion() {
  const container = document.createElement('div');
  container.className = 'question-container';

  const q = questions[currentQuestion];
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
        if (currentQuestion < questions.length) {
          showQuestion();
        } else {
          document.getElementById('result').textContent = `Your score: ${score} / ${questions.length}`;
        }
      }, 500);
    }, 1000);
  };

  container.appendChild(submitBtn);
  document.getElementById('quiz').appendChild(container);
}

showQuestion();
