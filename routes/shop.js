const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();
router.get("/favorites", shopController.getFavoriteProducts);
router.post("/favorites", shopController.postFavoriteProduct);
router.get("/:productId", shopController.getProduct);
router.get("/", shopController.getIndex);

module.exports = router;
