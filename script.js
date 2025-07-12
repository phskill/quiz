// 🔐 SHA-256 Password Hasher
async function hashPassword(password) {
  const buffer = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

// 🌐 Web App Routing via Proxy
const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
const webAppUrl = "https://script.google.com/macros/s/AKfycbw6VHjxMjj60jvfBT2HpeXQAgQzAEuoNVp1ql0rTDXRafPqeT8G6DVjgvIWLcxf1PKIog/exec";
const fullUrl = proxyUrl + encodeURIComponent(webAppUrl);

// 🔑 Login Request
async function handleLogin(userId, password) {
  const hashed = await hashPassword(password);
  try {
    const res = await fetch(fullUrl, {
      method: "POST",
      body: JSON.stringify({ mode: "login", userId, password: hashed }),
      headers: { "Content-Type": "application/json" }
    });
    const text = await res.text();
    console.log("🔐 Login Response:", text);
    return text;
  } catch (err) {
    console.error("🚫 Login Error:", err);
    return "Error connecting to server.";
  }
}

// 📝 Signup Request
async function handleSignup(userId, password, fullName) {
  const hashed = await hashPassword(password);
  try {
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
  } catch (err) {
    console.error("🚫 Signup Error:", err);
    return "Error connecting to server.";
  }
}

// 🧾 Submit Quiz Result
async function submitQuizResult(userId, chapter, score, wrongQuestion, chosenAnswer, correctAnswer) {
  try {
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
    console.log("✅ Result Submission:", text);
    return text;
  } catch (err) {
    console.error("🚫 Result Error:", err);
    return "Error submitting quiz result.";
  }
}

// 📊 Fetch Quiz History
async function fetchQuizHistory(userId) {
  try {
    const res = await fetch(fullUrl, {
      method: "POST",
      body: JSON.stringify({ mode: "quizHistory", user: userId }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    console.log("📚 History Fetched:", data);
    return data;
  } catch (err) {
    console.error("🚫 History Error:", err);
    return [];
  }
}
