const jwt = require("jsonwebtoken");
const { Role } = require("../models/roleModels");
const User = require("../models/userModels");
const verifyToken = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ msg: " No Token Provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, {
      password: 0,
    });
    if (!user) return res.status(404).json({ msg: "No User Found" });

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: " Unauthorization" });
  }
};
const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        next();
        return;
      }
    }

    return res.status(403).json({ msg: "Require Moderator Role!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Something Went Wrong, Can't Verify Role" });
  }
};
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).json({ msg: "Require Moderator Role!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const isAdminOrIsModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator" || roles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).json({ msg: "Require Admin Or Moderator Role!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isAdminOrIsModerator,
};
