const Product = require("../models/product");
// const Favorites = require("../models/favorite");

exports.getIndex = async (req, res, next) => {
  const prods = await Product.findAll();
  res.render("shop/index", { prods, user: req.user });
};

exports.getProduct = async (req, res, next) => {
  const id = req.params.productId;
  const prod = await Product.findByPk(id);
  if (prod == null) return res.redirect("/shop/");
  res.render("shop/product", { prod, user: req.user });
};

exports.getFavorites = async (req, res, next) => {
  const favorite = await req.user.getFavorite();
  const prods = await favorite.getProducts();
  res.render("shop/favorites", { prods, user: req.user });
};

exports.postFavorite = async (req, res, next) => {
  const id = req.body.productId;
  const favorite = await req.user.getFavorite();
  const prods = await favorite.getProducts({ where: { id } });
  const prod = (prods && prods[0]) || (await Product.findByPk(id));
  await favorite.addProduct(prod);
  res.redirect("/shop/favorites");
};

exports.postDeleteFavorite = async (req, res, next) => {
  const id = req.body.productId;
  const favorite = await req.user.getFavorite();
  const prods = await favorite.getProducts({ where: { id } });
  const prod = prods[0];
  await favorite.removeProduct(prod);
  res.redirect("/shop/favorites");
};
