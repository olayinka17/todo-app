const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/CustomError");
require("dotenv").config();

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token || token === "loggedOut") {
    return next(
      new CustomError("you are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new CustomError("the user this token belong to no longer exist", 401)
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

const isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt || req.cookies.jwt === "loggedOut") {
    return next();
  }
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    res.locals.user = currentUser;
    return next();
  }
  next();
});
module.exports = {
  protect,
  isLoggedIn,
};
