const { category } = require("../models/categoryModels");
const Products = require("../models/productModels");

const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find({});

    return res.status(200).json({ successful: true, data: categories });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      successful: false,
      msg: "Something Went Wrong , Could not all categories",
    });
  }
};
const createCategory = async (req, res) => {
  try {
    const newCategory = new category({ name: req.body.category });
    await newCategory.save();

    return res.status(200).json({
      successful: true,
      category: newCategory,
      msg: "Category ${newCategory} created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      successful: false,
      msg: "Something Went Wrong , Could not all categories",
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    await category.findByIdAndRemove(req.id);
    await Products.deleteMany({ category: req.categoryName });

    return res
      .status(200)
      .json({ successful: true, msg: "Category Successfully Deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      successful: false,
      msg: "Something Went Wrong , Could Delete Category",
    });
  }
};
const editCategoryName = async (req, res) => {
  try {
    const Category = await category.findByIdAndUpdate(req.id, {
      $set: { name: req.body.categoryNewName },
    });

    await Products.updateMany(
      { category: req.categoryName },
      { category: req.body.categoryNewName }
    );

    return res.status(200).json({
      successful: false,
      category: { ...category, name: req.body.categoryNewName },
      msg: "Category Successfully Renamed",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      successful: false,
      msg: "Something Went Wrong , Could not Delete category",
    });
  }
};

module.exports = {
  getAllCategories,
  deleteCategory,
  editCategoryName,
  createCategory,
};
