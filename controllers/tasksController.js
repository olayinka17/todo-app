const CatchAsync = require("../utils/catchAsync");
const Tasks = require("../model/tasks");
const CustomError = require("../utils/CustomError");

const getAllTasks = CatchAsync(async (req, res) => {
  let filter = { user: req.user.id };
  if (req.query.state) {
    filter.state = req.query.state;
  }
  const tasks = await Tasks.find(filter);
  console.log(filter);
  res.status(200).json({
    status: "success",
    data: {
      tasks,
    },
  });
});

const getTasksById = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  const task = await Tasks.findById(id);
  if (!task) {
    return next(new CustomError("specified task with the id not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});
const setUserIds = (req, res, next) => {
  const tasksInfo = req.body;
  if (!tasksInfo.user) tasksInfo.user = req.user.id;
  next();
};

const createTasks = CatchAsync(async (req, res) => {
  const tasksInfo = req.body;
  const task = await Tasks.create(tasksInfo);
  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

const updateTaskById = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  const taskInfo = req.body;
  const task = await Tasks.findByIdAndUpdate(id, taskInfo, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return next(new CustomError("specified task with the id not found", 404));
  }
  if (task.user._id.toString() !== req.user.id) {
    return next(new CustomError("this task does not belong to you", 403));
  }
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

const deleteTaskById = CatchAsync(async (req, res, next) => {
  const id = req.params.id;
  const task = await Tasks.findByIdAndUpdate(
    id,
    { state: "deleted" },
    { new: true }
  );
  if (!task) {
    return next(new CustomError("specified task with the id not found", 404));
  }

  if (task.user._id.toString() !== req.user.id) {
    return next(new CustomError("this task does not belong to you", 403));
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllTasks,
  getTasksById,
  createTasks,
  updateTaskById,
  deleteTaskById,
  setUserIds,
};
