const express = require("express");
const {
  registerController,
  loginController,
  logoutUser,
} = require("../controllers/userControllers");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutUser);

module.exports = router;
