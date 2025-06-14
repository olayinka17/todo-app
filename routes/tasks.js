const express = require("express");
const tasksController = require("../controllers/tasksController");
const authMiddleware = require("../middlewares/authMiddleware");

const Router = express.Router();

Router.use(authMiddleware.protect);

Router.get("/", tasksController.getAllTasks);
Router.get("/:id", tasksController.getTasksById);
Router.post("/", tasksController.setUserIds, tasksController.createTasks);
Router.patch("/:id", tasksController.updateTaskById);
Router.delete("/:id", tasksController.deleteTaskById);

module.exports = Router;
