const Product = require("../models/product");
exports.getIndex = (req, res, next) => {
  Product.getAll().then((data) => {
    console.log(data);
    res.render("shop/index", { prods: data });
  });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.getById(id).then((prod) => {
    res.render("shop/product", { prod });
  });
};
