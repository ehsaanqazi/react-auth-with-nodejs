const joi = require("joi");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 6,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  resetToken: {},
  resetTokenExpiration: {},
});

const User = mongoose.model("User", userSchema);

const signupValidation = joi.object({
  username: joi.string().min(6).max(50).required(),
  email: joi.string().min(10).max(255).required().email(),
  password: joi.string().min(5).max(255).required(),
  resetToken: joi.string(),
  resetTokenExpiration: joi.string(),
});

const loginValidation = joi.object({
  email: joi.string().min(10).max(255).required().email(),
  password: joi.string().min(5).max(255).required(),
});

const updateValidation = joi.object({
  username: joi.string().min(6).max(50),
  email: joi.string().min(10).max(255).email(),
  password: joi.string().min(5).max(255),
});

const passwordValidation = joi.object({
  currentPassword: joi.string().min(5).max(255).required(),
  password: joi.string().min(5).max(255).required(),
});

const singlePasswordValidation = joi.object({
  password: joi.string().min(5).max(255).required(),
});

const emailValidation = joi.object({
  email: joi.string().min(10).max(255).required().email(),
});

const usernameValidation = joi.object({
  username: joi.string().min(6).max(50).required(),
});

const tokenValidation = joi.object({
  token: joi.string().required(),
});

exports.User = User;
exports.signupValidation = signupValidation;
exports.loginValidation = loginValidation;
exports.updateValidation = updateValidation;
exports.passwordValidation = passwordValidation;
exports.emailValidation = emailValidation;
exports.usernameValidation = usernameValidation;
exports.tokenValidation = tokenValidation;
exports.singlePasswordValidation = singlePasswordValidation;
