import { showAlert } from "./alert.js";

const updateTasks = async (taskId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/tasks/${taskId}`,
      data: { state: "completed" },
    });
    if (res.data.status === "success") {
      showAlert("success", "task updated successfully");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err);
  }
};

const deleteTasks = async (taskId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/tasks/${taskId}`,
    });
    if (res.data.status === "success") {
      location.assign("/");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const completedBtn = document.querySelector(".completed__btn");

if (completedBtn) {
  completedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const taskId = e.currentTarget.dataset.taskId;
    updateTasks(taskId);
  });
}

const deletedBtn = document.querySelector(".deleted__btn");

if (deletedBtn) {
  deletedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const taskId = e.target.dataset.taskId;
    deleteTasks(taskId);
  });
}
