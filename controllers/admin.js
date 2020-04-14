const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product");
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const { title, price, description, url } = req.body;
  new Product(title, url, price, description).save();
};

exports.getProducts = (req, res, next) => {
  Product.getAll().then((data) => {
    res.render("admin/products", {
      prods: data,
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.getById(id).then((prod) => {
    res.render("admin/edit-product", { prod });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, url, price, description } = req.body;
  Product.modById(id, { title, url, price, description }).then(() => {
    res.redirect("/admin/products");
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body;
  Product.delById(id).then(() => res.redirect("/admin/products"));
};
