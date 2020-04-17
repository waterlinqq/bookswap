const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { user: req.user });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user == null) return res.redirect("/");
  if (password !== user.password) return res.redirect("/");
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  let user = await User.findOne({ where: { email } });
  if (user) return res.redirect("/");
  user = await User.create({ email, password });
  await user.createFavorite();
  res.redirect("/login");
};
