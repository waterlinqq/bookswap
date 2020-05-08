const express = require("express");

const transActionController = require("../controllers/transaction");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/order/:productId", isAuth, transActionController.getOrder);
router.post("/order/:productId", isAuth, transActionController.postOrder);
router.get("/buy", isAuth, transActionController.getBuy);
router.get("/sell", isAuth, transActionController.getSell);
router.get("/:transactionId", isAuth, transActionController.getOrderDetail);
router.get("/", isAuth, transActionController.getIndex);
router.post("/cancel/:transactionId", isAuth, transActionController.postCancel);
router.post("/agree/:transactionId", isAuth, transActionController.postAgree);
module.exports = router;
