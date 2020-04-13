const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", adminController.getAddProduct);

module.exports = router;
