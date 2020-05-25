module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.flash("hint", "請先登入");
    return res.redirect("/");
  }
  next();
};
