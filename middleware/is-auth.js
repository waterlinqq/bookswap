module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.flash("hint", "請先登入。測試帳號：test@test.com 測試密碼：testtest");
    return res.redirect("/");
  }
  next();
};
