import { showAlert } from "./alert.js";

const updateTasks = async (taskId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:7000/api/v1/tasks/${taskId}`,
      data: { state: "completed" },
    });
    //console.log(url);
    console.log(res.data);
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
      url: `http://127.0.0.1:7000/api/v1/tasks/${taskId}`,
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
    console.log(taskId);
    updateTasks(taskId);
    // console.log(updateTasks(taskId));
  });
}

// document.querySelectorAll(".tasks__btn").forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     e.preventDefault();

//     // Always use e.currentTarget to reliably get the button, not e.target.
//     const taskId = e.currentTarget.dataset.taskId;

//     console.log("Clicked Task ID:", taskId); // Should print correctly
//     updateTasks(taskId); // Your axios function
//   });
// });

const deletedBtn = document.querySelector(".deleted__btn");

if (deletedBtn) {
  deletedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const taskId = e.target.dataset.taskId;
    deleteTasks(taskId);
  });
}
