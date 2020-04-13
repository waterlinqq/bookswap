const Product = require("../models/product");
exports.getIndex = (req, res, next) => {
  Product.getAll().then((data) => {
    console.log(data);
    res.render("shop/index", { prods: data });
  });
};
