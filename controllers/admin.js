const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product");
};

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description, url } = req.body;
  await req.user.createProduct({ title, price, description, url });
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  const prods = await req.user.getProducts();
  res.render("admin/products", { prods });
};

exports.getEditProduct = async (req, res, next) => {
  const id = req.params.productId;
  const prods = await req.user.getProducts({ where: { id } });
  const prod = prods[0];
  if (prod == null) res.redirect("/");
  res.render("admin/edit-product", { prod });
};

exports.postEditProduct = async (req, res, next) => {
  const { id, title, url, price, description } = req.body;
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
