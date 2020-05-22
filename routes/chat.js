const express = require("express");

const chatController = require("../controllers/chat");
const isAuth = require("../middleware/is-auth");
const getRecent = chatController.getRecent;

const router = express.Router();

// router.get("/",getRecent, isAuth, chatController.getRoot);
router.get("/:userId", isAuth, getRecent, chatController.getChat);
router.get("/", isAuth, getRecent, chatController.getIndex);

module.exports = router;
