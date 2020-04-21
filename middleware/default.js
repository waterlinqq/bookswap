module.exports = (req, res, next) => {
  res.locals.value = {};
  res.locals.errorMessage = null;
  res.locals.errorParam = "";
  next();
};
