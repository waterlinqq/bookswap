const User = require("../models/user");
const bycrypt = require("bcryptjs");

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
};
