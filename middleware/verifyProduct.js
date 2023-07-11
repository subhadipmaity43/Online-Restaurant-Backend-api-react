const { category } = require("../models/categoryModels");
const checkCategoryExist = async (req, res, next) => {
  console.log(req.body);
  try {
    const categoryFound = await category.findOne({ name: req.body.category });
    if (!categoryFound)
      return res
        .status(404)
        .json({ successful: false, msg: "Not Category Found" });
    req.id = categoryFound._id;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "something went , category existence verification fail",
    });
  }
};

module.exports = checkCategoryExist;
