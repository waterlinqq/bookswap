const User = require("../models/user");
module.exports = async (req, res, next) => {
  if (!req.session.user) return next();
  const user = await User.findByPk(req.session.user.id);
  req.user = res.locals.user = user;
  next();
};
