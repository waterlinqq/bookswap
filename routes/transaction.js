const express = require("express");

const transActionController = require("../controllers/transaction");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/buy/:productId", isAuth, transActionController.getBuy);
router.post("/buy/:productId", isAuth, transActionController.postBuy);
router.get("/", isAuth, transActionController.getIndex);

module.exports = router;
