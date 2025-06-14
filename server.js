// const express = require("express");
const { connectionToDb } = require("./db");
const app = require("./app");
require("dotenv").config();

const port = process.env.port;

// const app = express();

connectionToDb();
const server = app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
