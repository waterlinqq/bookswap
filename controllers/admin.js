const { validationResult } = require("express-validator/check");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product");
};

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description, url } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).render("admin/add-product", {
      value: { title, price, description, url },
      errorMessage: errors.array()[0].msg,
      errorParam: errors.array()[0].param,
    });
  await req.user.createProduct({ title, price, description, url });
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  const prods = await req.user.getProducts();
  res.render("admin/products", { prods });
};

exports.getEditProduct = async (req, res, next) => {
  const id = req.params.productId;
  const [prod] = await req.user.getProducts({ where: { id } });
  if (prod == null) res.redirect("/");
  res.render("admin/edit-product", { prod });
};

exports.postEditProduct = async (req, res, next) => {
  const { id, title, url, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).render("admin/add-product", {
      value: { title, url, price, description },
      errorMessage: errors.array()[0].msg,
      errorParam: errors.array()[0].param,
    });
  const prod = await Product.findByPk(id);
  if (prod.userId.toString() !== req.user.id.toString())
    return res.redirect("/");
  prod.title = title;
  prod.url = url;
  prod.price = price;
  prod.description = description;
  await prod.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.productId;
  const prod = await Product.findOne({ where: { id, userId: req.user.id } });
  if (prod) await prod.destroy();
  res.redirect("/admin/products");
};
