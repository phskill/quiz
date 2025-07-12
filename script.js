const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeMq5VrWndE6OZqE4aSrpj-MQhSYp5g7OlhZCY9cy1giwPhpyiIkQGCvzFA6-Ae-cGI6ICPkfy1o4F/pub?output=csv";

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
  // Your quiz logic goes here
}
