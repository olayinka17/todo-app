const { connectionToDb } = require("./db");
const app = require("./app");
require("dotenv").config();

const port = process.env.PORT;

const cors = require("cors");

connectionToDb();

app.use(
  cors({
    origin: "https://tasksup.onrender.com",
    credentials: true,
  })
);

const server = app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
