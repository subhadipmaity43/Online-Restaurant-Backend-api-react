const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter your firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter your lastname"],
  },

  phoneno: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  // confirmPassword: {
  //   type: String,
  //   required: [true, "please re-enter your password"],
  // },
});

// Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});
// Encrypt confirmPassword
userSchema.pre("save", async function (next) {
  if (!this.isModified("confirmPassword")) {
    return next();
  }
  // Hash confirmPassword
  const salt1 = await bcrypt.genSalt(10);
  const hashedPassword1 = await bcrypt.hash(this.confirmPassword, salt1);
  this.confirmPassword = hashedPassword1;
  next();
});

// routes - middleware - controller

const User = mongoose.model("User", userSchema);

module.exports = User;
