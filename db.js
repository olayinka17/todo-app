const mongoose = require("mongoose");
require("dotenv").config();
MONGO_URI = process.env.MONGO_URI;

const connectionToDb = () => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.on("connected", () => {
    console.log("Connection to database successfully");
  });
  mongoose.connection.on("error", () => {
    console.log("Error: Unable to connect to the database");
  });
};

module.exports = {
  connectionToDb,
};
