const mongoose = require("mongoose");

const TasksSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "please provide a title"],
  },
  content: {
    type: String,
    required: [true, "Tasks must surely have a content"],
  },
  state: {
    type: String,
    enum: ["pending", "completed", "deleted"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: [true, "Task must belong to a user"],
  },
});
TasksSchema.index({ title: 1, user: 1 }, { unique: 1 });
TasksSchema.index({ state: 1 });
TasksSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});
TasksSchema.pre(/^find/, function (next) {
  const currentQuery = this.getFilter();

  // Only add the "not deleted" filter if user did not already specify state
  if (!currentQuery.state) {
    this.setQuery({
      ...currentQuery,
      state: { $ne: "deleted" },
    });
  }
  // this.find({ state: { $ne: "deleted" } });
  next();
});
module.exports = mongoose.model("tasks", TasksSchema);
