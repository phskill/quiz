# 🔐 QuizVerse — Personalized Quiz Platform

QuizVerse is a secure, user-friendly web-based quiz system that combines the simplicity of Google Sheets with the power of HTML/CSS/JS and Apps Script. Users can sign up, log in, take chapter-based quizzes, view past performance, and retry their mistakes — all from a responsive interface.

---

## 🌟 Features

- 👤 **User Authentication** — Secure signup & login with SHA-256 hashed passwords
- 🧠 **Topic-Based Quizzes** — Questions pulled live from Google Sheets by chapter
- 📊 **Progress Tracking** — Full profile dashboard showing scores, mistakes & history
- 🔁 **Retry Engine** — Review and retake only the questions you got wrong
- 🎨 **Stylish UI** — Glowing gradients, smooth interactions, mobile-responsive
- ☁️ **No Server Required** — Data stored directly in Google Sheets

---

## 🧩 Technologies Used

- **Google Sheets** as backend database  
- **Google Apps Script** for serverless logic & API  
- **HTML/CSS/JavaScript** for frontend  
- **PapaParse** to parse CSV from Google Sheets  
- **Session Storage** for login state

---

## 📁 Project Structure

```plaintext
├── index.html         # Dashboard & Chapter selection
├── login.html         # User login form
├── signup.html        # Account creation
├── profile.html       # View past results & retry mistakes
├── quiz.html          # Take quiz dynamically
├── style.css          # Glowing UI styling
├── script.js          # Quiz engine & scoring logic
├── README.md          # Documentation

🗂 Sheet Setup
Google Spreadsheet Tabs:

users

Stores: userId, password, name, createdOn

userdata

Stores: User, Chapter, Score, Timestamp, WrongQuestion, ChosenAnswer, CorrectAnswer

Published CSV Source

A public sheet containing all quiz questions by chapter, published as CSV
🌐 Setup Guide
Create and configure your Google Spreadsheet tabs (users, userdata, questions)

Paste Apps Script backend into Script Editor

Deploy Web App URL with access to anyone

Add Web App URL into frontend fetch calls

Publish question sheet as CSV (pub?output=csv)

Host your HTML pages using GitHub Pages, Firebase, or locally

📣 Want to Contribute?
Feel free to:

Submit new quiz chapters via Sheets

Enhance the UI

Add timed questions or leaderboard

Translate into multiple languages

Create a badge system or certificate feature!

Pull requests welcome 🌱
💡 Credits
Created by Parikshit with 💙 and Apps Script magic. Frontend inspired by glowing futuristic portals 🪐 Powered by learners. Refined by feedback.
🖋 License
MIT License — use freely, learn freely, share freely.

---

Want me to help you generate a GitHub repository description or create a banner/logo for your public launch? This quizverse is ready to shine ✨📚 Let’s get the world learning.
