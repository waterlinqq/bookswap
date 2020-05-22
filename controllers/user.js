const User = require("../models/user");

exports.getIndex = async (req, res, next) => {
  const dest = "user/index";
  const users = await User.findAll();
  res.render(dest, { users, dest });
};
exports.getUser = async (req, res, next) => {
  const dest = "user/user";
  const { userId } = req.params;
  const findUser = await User.findByPk(userId);
  if (findUser == null) {
    return res.redirect("/");
  }
  return res.render(dest, { findUser, dest });
};
