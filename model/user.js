const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "User must have a username"],
    maxLength: [15, "username must not be longer than 15 characters"],
    minLength: [3, "username must be equal to or more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "please enter a password."],
    minLength: [8, "Your password must not be lower than 8 characters"],
    select: false,
  },
  confirmedPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      // this only works on SAVE and CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same",
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmedPassword = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("users", UserSchema);
