const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  postNewProduct,
  updateProductById,
  deleteProductById,
} = require("../controllers/productControllers");
// const { verifyToken, isAdmin } = require("../middleware/authJwt");
// const checkCategoryExist = require("../middleware/verifyProduct");
// const checkIsValidId = require("../middleware/check");

router.get("/get", getAllProducts);
// router.get("/:id", getProductById);
router.post("/add", postNewProduct);
router.put("/update/:id", updateProductById);
router.delete("/delete/:id", deleteProductById);

module.exports = router;
