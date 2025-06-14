const User = require("../model/user");
const CatchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const CustomError = require("../utils/CustomError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCreatedToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieoptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieoptions.secure = true;
  res.cookie("jwt", token, cookieoptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
  });
  sendCreatedToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1) checking if email and password exist in the body
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }
  // 2) checking if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("Incorect email or password", 401));
  }
  const isMatch = await user.correctPassword(password, user.password);

  if (!isMatch) {
    return next(new CustomError("Incorect email or password", 401));
  }
  // 3) if everything is ok, send token to client
  sendCreatedToken(user, 200, res);
});

const logout = (req, res) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
