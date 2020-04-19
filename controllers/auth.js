const bycrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

const User = require("../models/user");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'a10311036@gmail.com',
//   from: 'bookswap@gmail.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);

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
