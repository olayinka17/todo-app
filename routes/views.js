const express = require("express");
const viewsController = require("../controllers/viewsController");
const authMiddleware = require("../middlewares/authMiddleware");

const Router = express.Router();

Router.get("/", viewsController.getOverviewPage);
Router.get(
  "/completed",
  authMiddleware.isLoggedIn,
  viewsController.getCompletedTasks
);
Router.get(
  "/pending",
  authMiddleware.isLoggedIn,
  viewsController.getPendingTasks
);
Router.get("/add-tasks", authMiddleware.isLoggedIn, viewsController.addTasks);
Router.get("/login", viewsController.getLoginForm);
Router.get("/signup", viewsController.getSignupForm);
Router.get("/tasks/:id", authMiddleware.protect, viewsController.getOneTask);
module.exports = Router;
