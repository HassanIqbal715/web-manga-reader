const express = require("express");
const path = require("path");
const app = express();
const session = require('express-session');
require('dotenv').config();
const hostname = 'localhost';
const port = 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});