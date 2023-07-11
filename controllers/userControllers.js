const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, "ThisIsSecret", {
    expiresIn: "1d",
  });
};

const registerController = async (req, res) => {
  // console.log(req);
  const { firstname, lastname, phoneno, email, password, confirmpassword } =
    req.body;

  if (
    !firstname ||
    !lastname ||
    !phoneno ||
    !email ||
    !password ||
    !confirmpassword
  ) {
    res.status(404).json({
      status: 0,
      msg: "Please enter valid name or email or password.",
    });
    return;
  }

  if (password !== confirmpassword) {
    res.status(404).json({ status: 0, msg: "Passwords do not match." });
    return;
  }

  const userExits = await User.findOne({ email });
  // console.log(userExits);
  if (userExits) {
    res
      .status(400)
      .json({ status: 0, msg: "You're already registered. Please Login." });
    return;
  }

  try {
    const user = await User.create(req.body);
    // console.log(userExits._id);

    let token = generateToken(user._id);
    console.log(token);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: false,
    });

    res.status(201).json({ status: 1, msg: "User Register Successful" });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(email, password);
  if (!email || !password) {
    res
      .status(404)
      .json({ status: 0, msg: "Please Enter Email-Id and Password!!" });
    return;
  }

  const userExits = await User.findOne({ email });
  if (!userExits) {
    res
      .status(404)
      .json({ status: 0, msg: "You're not registered. Please Register." });
    return;
  }

  const compare = await bcrypt.compare(password, userExits.password);
  if (!compare) {
    res.status(400).json({ status: 0, msg: "Inavalid Password" });
    return;
  }

  let token = generateToken(userExits._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: false,
  });

  res.status(200).json({
    status: 1,
    user: userExits,
    msg: "Successfully Logged In",
  });
};

const logoutUser = (res) => {
  res.cookie("token", null, {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ msg: "Succfully logout!" });
};
module.exports = { registerController, loginController, logoutUser };
