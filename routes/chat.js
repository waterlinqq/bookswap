const express = require("express");

const chatController = require("../controllers/chat");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/:userId", isAuth, chatController.getChat);
router.get("/", isAuth, chatController.getChat);
module.exports = router;
