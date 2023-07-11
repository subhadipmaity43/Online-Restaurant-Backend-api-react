const Product = require("../models/productModels");
const { category } = require("../models/categoryModels");
const cloudinary = require("cloudinary");
const path = require("path");

const getAllProducts = async (req, res) => {
  try {
    const totalResults = await Product.find();

    return res.status(200).json({ success: true, products: totalResults });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: error.msg });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: error.msg });
  }
};

const postNewProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    if (!name || !description || !price || !category || !image) {
      res.status(400).json({ success: false, msg: "Provide All Fields" });
      return;
    }
    const existProduct = await Product.find({ name: name });
    if (!existProduct) {
      res.status(400).json({ success: false, msg: "Product Already Exits" });
      return;
    }
    await Product.create(req.body);
    res.status(200).json({ success: true, msg: "Product Added Successfully" });
    return;
  } catch (err) {
    res.status(400).json({ success: false, msg: "Some error occured" });
  }
};

const updateProductById = async (req, res) => {
  const { name, category, price, image, description, active } = req.body;
  // const price = parseInt(req.body.price);
  try {
    const productFound = await Product.findById(req.params.id);
    if (!productFound) {
      return res.status(400).json({ success: false, msg: "product not found" });
    }

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        description: description,
        category: category,
        price: price,
        image: image,
        active: active,
      }
      // { new: true }
    );
    // console.log(updateProduct);
    return res.status(200).json({ success: true, msg: "Update Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, msg: error.msg });
  }
};

const deleteProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, msg: "product not found" });
    // await category.decrementCategoryProducts(product.category);
    await Product.findByIdAndRemove(req.params.id);

    return res
      .status(200)
      .json({ success: true, msg: "product has been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong, product was not delete correctly",
    });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  postNewProduct,
  updateProductById,
  deleteProductById,
};
