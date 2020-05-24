module.exports = async (req, res, next) => {
  const hint = req.flash("hint");
  if (hint.length) {
    res.locals.hint = hint.join("\n");
  }
  next();
};
