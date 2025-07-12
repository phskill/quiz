const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeMq5VrWndE6OZqE4aSrpj-MQhSYp5g7OlhZCY9cy1giwPhpyiIkQGCvzFA6-Ae-cGI6ICPkfy1o4F/pub?output=csv";

let currentQuestion = 0;
let score = 0;

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;
    const chapters = {};

    data.forEach(row => {
      const chapter = row["Chapter"];
      if (!chapters[chapter]) chapters[chapter] = [];
      chapters[chapter].push({
        text: row["Question"],
        options: [row["Option1"], row["Option2"], row["Option3"], row["Option4"]],
        answer: parseInt(row["AnswerIndex"])
      });
    });

    const select = document.getElementById("chapter-select");
    Object.keys(chapters).forEach(ch => {
      const opt = document.createElement("option");
      opt.value = ch;
      opt.textContent = ch;
      select.appendChild(opt);
    });

    select.onchange = () => {
      document.getElementById("start-btn").disabled = !select.value;
    };

    document.getElementById("start-btn").onclick = () => {
      const selected = select.value;
      if (selected && chapters[selected]) {
        currentQuestion = 0;
        score = 0;
        document.getElementById("quiz").innerHTML = "";
        document.getElementById("result").style.display = "none";
        document.getElementById("chapter-select-container").style.display = "none";
        document.getElementById("percent-display").style.display = "block";
        startQuiz(chapters[selected]);
      }
    };
  }
});

function startQuiz(questionsArray) {
  updateProgressInfo();

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

          updateProgressInfo(currentQuestion, questionsArray.length);

          if (currentQuestion < questionsArray.length) {
            showQuestion(
