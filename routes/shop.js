const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/favorites", isAuth, shopController.getFavorites);
router.post("/favorites", isAuth, shopController.postFavorite);
router.post("/delete-favorite", isAuth, shopController.postDeleteFavorite);
router.post("/search", shopController.postSearch);
router.post("/:productId", shopController.postMessage);
router.get("/:productId", shopController.getProduct);
router.get("/", shopController.getIndex);

module.exports = router;
