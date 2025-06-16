import { showAlert } from "./alert.js";

const signup = async (username, email, password, confirmedPassword) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:7000/api/v1/users/signup",
      data: {
        username,
        email,
        password,
        confirmedPassword,
      },
      withCredentials: true,
    });
    if (res.data.status === "success") {
      showAlert("success", "Sign up successful. welcome aboard.");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const signupForm = document.querySelector(".form__signup");

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmedPassword =
      document.getElementById("confirmedPassword").value;
    signup(username, email, password, confirmedPassword);
  });
}
