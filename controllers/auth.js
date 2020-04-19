const crypto = require("crypto");
const bycrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const Op = require("sequelize").Op;

const myPromise = require("../utils/my-promise");
const User = require("../models/user");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  const [errorMessage] = req.flash("error");
  res.render("auth/login", { user: req.user, errorMessage });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }
  const result = await bycrypt.compare(password, user.password);
  if (!result) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }
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
  const { email, password, confirmPassword } = req.body;
  const hashPassord = await bycrypt.hash(password, 12);
  let user = await User.findOne({ where: { email } });
  if (user) {
    req.flash("error", "The email has been registered");
    return res.redirect("/signup");
  }
  user = await User.create({ email, password: hashPassord });
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
  const tokenP = new myPromise();
  crypto.randomBytes(32, (err, buffer) =>
    tokenP.resolve(buffer.toString("hex"))
  );
  const token = await tokenP;
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
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  res.redirect("/");
};
