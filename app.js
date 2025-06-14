const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const TasksRouter = require("./routes/tasks");
const UserRouter = require("./routes/user");
const globalErrorHandler = require("./controllers/errorController");
const CustomError = require("./utils/CustomError");
const ViewRouter = require("./routes/views");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
console.log(app.get("env"));

// global middlewares

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/api/v1/tasks", TasksRouter);
app.use("/api/v1/users", UserRouter);
app.use("/", ViewRouter);

app.get("/api/v1/", (req, res) => {
  res.send("welcome to the home API");
});

app.use((req, res, next) => {
  next(new CustomError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
