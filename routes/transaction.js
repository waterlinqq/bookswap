const express = require("express");

const transActionController = require("../controllers/transaction");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/order/:productId", isAuth, transActionController.getOrder);
router.post("/order/:productId", isAuth, transActionController.postOrder);
router.get("/", isAuth, transActionController.getIndex);

module.exports = router;
