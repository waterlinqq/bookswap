const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();
router.get("/", shopController.getIndex);
router.get("/:productId", shopController.getProduct);

module.exports = router;
