const Task = require("../model/tasks");
const CatchAsync = require("../utils/catchAsync");

const getOverviewPage = CatchAsync(async (req, res, next) => {
  let filter;
  if (filter) {
    filter = { user: res.locals.user.id };
  }
  const tasks = await Task.find(filter);

  res.status(200).render("overview", {
    title: "My tasks",
    tasks,
  });
});

const getCompletedTasks = CatchAsync(async (req, res, next) => {
  const tasks = await Task.find({
    state: "completed",
    user: res.locals.user.id,
  });

  res.status(200).render("completed", {
    title: "my completed tasks",
    tasks,
  });
});

const getPendingTasks = CatchAsync(async (req, res, next) => {
  const tasks = await Task.find({ state: "pending", user: res.locals.user.id });

  res.status(200).render("pending", {
    title: "my pending tasks",
    tasks,
  });
});
const getOneTask = CatchAsync(async (req, res, next) => {
  // let filter = { user: res.locals.user.id };
  const task = await Task.findById(req.params.id);
  res.status(200).render("tasks", {
    title: "task",
    task,
  });
});

const addTasks = CatchAsync(async (req, res, next) => {
  res.status(201).render("addTasks", {
    title: "create tasks",
  });
});
const getLoginForm = CatchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "log into your account",
  });
});

const getSignupForm = CatchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signing up",
  });
});

module.exports = {
  getOverviewPage,
  getLoginForm,
  getCompletedTasks,
  getPendingTasks,
  getOneTask,
  addTasks,
  getSignupForm,
};
