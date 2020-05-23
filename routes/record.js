const express = require("express");

const recordController = require("../controllers/record");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, recordController.getIndex);

module.exports = router;
