const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();
const checkLogin = [
  body("email", "請輸入正確信箱格式").isEmail().normalizeEmail(),
  body("password", "請輸入正確密碼")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
];
const checkSighup = [
  body("email", "請輸入正確信箱格式")
    .isEmail()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) return Promise.reject("該信箱已經被註冊過");
    })
    .normalizeEmail(),
  body("password", "密碼需包含五位以上的英數字")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("密碼不一致");
      return true;
    }),
];
const checkNewPassword = [
  body("password", "請輸入正確密碼")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
];

router.get("/login", authController.getLogin);

router.post("/login", checkLogin, authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", checkSighup, authController.postSignup);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:resetToken", authController.getNewPassword);

router.post("/new-password", checkNewPassword, authController.postNewPassword);

module.exports = router;
