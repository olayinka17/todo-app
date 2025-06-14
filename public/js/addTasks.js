import { showAlert } from "./alert.js";
const addTasks = async (title, content) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:7000/api/v1/tasks",
      data: {
        title,
        content,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Task addedd successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const createForm = document.querySelector(".add-task-form");

if (createForm) {
  createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    addTasks(title, content);
  });
}
