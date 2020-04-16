const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();
router.get("/favorites", shopController.getFavorites);
router.post("/favorites", shopController.postFavorite);
router.get("/:productId", shopController.getProduct);
router.post("/delete-favorite", shopController.postDeleteFavorite);
router.get("/", shopController.getIndex);

module.exports = router;
