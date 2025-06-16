const CustomError = require("../utils/CustomError");

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new CustomError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value : ${value}. please use another value!`;
  return new CustomError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new CustomError(message, 400);
};
const handleJWTError = () => {
  new CustomError("Invalid Token. please login again", 401);
};
const handleExpiredJWTError = () => {
  new CustomError("your token has expired. please login again", 401);
};
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack,
    });
  }
  // rendered website

  return res.status(err.statusCode).render("error", {
    title: "something went wrong",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // API

    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // programming or other unknown error
    console.error("ERROR", err);
    // sending generic message
    return res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }

  // rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "something went wrong",
      msg: err.message,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "something went wrong",
    msg: "please try again later",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);
    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleExpiredJWTError();
    sendErrorProd(error, req, res);
  }
};
