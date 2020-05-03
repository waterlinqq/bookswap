const { validationResult } = require("express-validator/check");

const fileHelper = require("../utils/file-helper");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product");
};

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description, author, isbn, category } = req.body;
  const errors = validationResult(req);
  if (req.files.length == 0)
    return res.status(422).render("admin/add-product", {
      value: { title, price, description, isbn, author, category },
      errorMessage: "請至少提供一張圖片",
      errorParam: "images",
    });
  if (!errors.isEmpty())
    return res.status(422).render("admin/add-product", {
      value: { title, price, description, isbn, author, category },
      errorMessage: errors.array()[0].msg,
      errorParam: errors.array()[0].param,
    });
  const url = JSON.stringify(req.files.map((file) => file.filename));
  await req.user
    .createProduct({
      title,
      price,
      description,
      url,
      isbn,
      author,
      category,
    })
    .catch(console.log);
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
  res.render("admin/edit-product", { value: prod });
};

exports.postEditProduct = async (req, res, next) => {
  const { id, title, price, description, author, isbn, category } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).render("admin/add-product", {
      value: {
        title,
        price,
        description,
        author,
        isbn,
        author,
        isbn,
        category,
      },
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
  prod.author = author;
  prod.isbn = isbn;
  prod.category = category;
  await prod.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.productId;
  const prod = await Product.findOne({ where: { id, userId: req.user.id } });
  for (const url of JSON.parse(prod.url)) {
    fileHelper.deleteFile("public/" + url);
  }
  if (prod) await prod.destroy();
  res.redirect("/admin/products");
};

exports.getUser = (req, res, next) => {
  return res.render("admin/user");
};

exports.postUser = async (req, res, next) => {
  const { username, description, city, delivery } = req.body;
  const user = req.user;
  user.username = username;
  user.description = description;
  user.city = city;
  user.delivery = JSON.stringify(delivery);
  await user.save();
  return res.redirect("/admin");
};
