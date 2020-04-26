const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const checkProduct = [
  body("title").isString().isLength({ min: 3 }).trim(),
  body("url").isURL(),
  body("price").isNumeric(),
  body("description").isLength({ max: 400 }).trim(),
  body("author").isLength({ max: 12 }).trim(),
  body("isbn").isLength({ max: 17 }).trim(),
];

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  checkProduct,
  isAuth,
  adminController.postAddProduct
);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  checkProduct,
  isAuth,
  adminController.postEditProduct
);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
