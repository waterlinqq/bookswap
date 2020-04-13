const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product");
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const { title, price, description, url } = req.body;
  new Product(title, url, price, description).save();
};
