// 🔐 Hashing Utility
async function hashPassword(password) {
  const buffer = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// 🌐 Proxy Setup
const proxyUrl = "https://api.cors.lol/?url=";
const webAppUrl = "https://script.google.com/macros/s/AKfycbwQBF2KwBonAe0SifJdJF1N2xLSn1vS1V3p84siclSaxaarF2-LZHNZzdqvrU4ynFWz/exec";
const fullUrl = proxyUrl + encodeURIComponent(webAppUrl);

// 🔑 Login Handler
async function handleLogin(userId, password) {
  const hashed = await hashPassword(password);

  const res = await fetch(fullUrl, {
    method: "POST",
    body: JSON.stringify({ mode: "login", userId, password: hashed }),
    headers: { "Content-Type": "application/json" }
  });

  const text = await res.text();
  console.log("🔐 Login Response:", text);
  return text;
}

// 📝 Signup Handler
async function handleSignup(userId, password, fullName) {
  const hashed = await hashPassword(password);

  const res = await fetch(fullUrl, {
    method: "POST",
    body: JSON.stringify({
      mode: "signup",
      userId,
      password: hashed,
      name: fullName,
      createdOn: new Date().toLocaleString()
    }),
    headers: { "Content-Type": "application/json" }
  });

  const text = await res.text();
  console.log("📦 Signup Response:", text);
  return text;
}

// 📊 Quiz Result Submission
async function submitQuizResult(userId, chapter, score, wrongQuestion, chosenAnswer, correctAnswer) {
  const res = await fetch(fullUrl, {
    method: "POST",
    body: JSON.stringify({
      mode: "quizResult",
      user: userId,
      chapter,
      score,
      wrongQuestion,
      chosenAnswer,
      correctAnswer
    }),
    headers: { "Content-Type": "application/json" }
  });

  const text = await res.text();
  console.log("✅ Result Submission Response:", text);
  return text;
}

// 📜 Fetch Quiz History
async function fetchQuizHistory(userId) {
  const res = await fetch(fullUrl, {
    method: "POST",
    body: JSON.stringify({ mode: "quizHistory", user: userId }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  console.log("🗂️ History Fetch Response:", data);
  return data;
}
