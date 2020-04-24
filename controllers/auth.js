const crypto = require("crypto");
const bycrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const Op = require("sequelize").Op;
const { validationResult } = require("express-validator/check");

const denodeify = require("../utils/denodeify");
const User = require("../models/user");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  const [errorMessage] = req.flash("error");
  res.render("auth/login", { user: req.user, errorMessage });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      value: { email },
      errorMessage: errors.array()[0].msg,
      errorParam: errors.array()[0].param,
    });
  }

  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(422).render("auth/login", {
      value: { email },
      errorMessage: "帳號或密碼錯誤",
    });
  const result = await bycrypt.compare(password, user.password);
  if (!result)
    return res.status(422).render("auth/login", {
      value: { email },
      errorMessage: "帳號或密碼錯誤",
    });
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};

exports.getSignup = (req, res, next) => {
  const [errorMessage] = req.flash("error");
  res.render("auth/signup", { errorMessage });
};

exports.postSignup = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      value: { email },
      errorMessage: errors.array()[0].msg,
      errorParam: errors.array()[0].param,
    });
  }
  const hashPassord = await bycrypt.hash(password, 12);

  const user = await User.create({ email, password: hashPassord });
  await user.createFavorite();
  res.redirect("/login");
  const msg = {
    to: email,
    from: "a10311036@gmail.com",
    subject: "註冊成功",
    html: "<strong>您已成功註冊</strong>",
  };
  sgMail.send(msg);
};

exports.getReset = (req, res, next) => {
  const [errorMessage] = req.flash("error");
  res.render("auth/reset", { errorMessage });
};

exports.postReset = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user == null) {
    req.flash("error", "No accouts with that email found!");
    res.redirect("/reset");
  }
  const buffer = await denodeify(crypto.randomBytes.bind(crypto))(32);
  const token = buffer.toString("hex");
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save();
  res.redirect("/");
  const msg = {
    to: email,
    from: "a10311036@gmail.com",
    subject: "密碼重置",
    html: `
      <p>您發起重置密碼的請求</p>
      <p>點擊<a href="http://localhost:3001/reset/${token}">這裏</a>進行重置作業</p>
      `,
  };
  sgMail.send(msg);
};

exports.getNewPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const user = await User.findOne({
    where: {
      resetToken,
      resetTokenExpiration: { [Op.gte]: Date.now() },
    },
  });
  const [errorMessage] = req.flash("error");
  res.render("auth/new-password", {
    errorMessage,
    userId: user.id.toString(),
    resetToken,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { password, resetToken, userId } = req.body;
  const user = await User.findOne({
    where: {
      resetToken,
      resetTokenExpiration: { [Op.gte]: Date.now() },
      id: userId,
    },
  });
  const hashPassword = await bycrypt.hash(password, 12);
  user.password = hashPassword;

  user.resetToken = null;
  user.resetTokenExpiration = null;

  // user.resetToken = undefined;
  // user.resetTokenExpiration = undefined;
  await user.save();
  res.redirect("/");
};
