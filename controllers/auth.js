const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", { user: req.user });
};

exports.postLogin = async (req, res, next) => {
  const user = await User.findByPk(1);
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};
