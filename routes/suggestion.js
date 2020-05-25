const express = require("express");

const suggestionController = require("../controllers/suggestion");

const router = express.Router();

router.get("/", suggestionController.getIndex);
router.get("/send", suggestionController.getSend);

module.exports = router;
