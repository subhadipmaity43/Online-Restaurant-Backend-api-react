const { category } = require("../models/categoryModels");

const checkDuplicateCategory = async (req, res, next) => {
  try {
    const categoryFound = await category.findOne({ name: req.body.category });
    if (categoryFound)
      return req
        .status(401)
        .json({ successful: false, msg: "The Category Already Exist" });
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        msg: "Something Went Wrong,Duplicate Category Verification Failed",
      });
  }
};

const checkCategoryExist = async (req, res, next) => {
  try {
    const categoryFound = await category.findById(req.params.id);
    if (!categoryFound)
      return req
        .status(401)
        .json({ successful: false, msg: "Not Category Found" });
    req.id = categoryFound._id;
    req.categoryName = categoryFound.name;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        success: false,
        msg: "Something Went Wrong, Category Existence Verification Fail",
      });
  }
};
module.exports = { checkDuplicateCategory, checkCategoryExist };
