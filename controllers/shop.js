const Product = require("../models/product");
// const Favorites = require("../models/favorite");

exports.getIndex = async (req, res, next) => {
  const dest = "shop/index";
  const { category } = req.query;
  const filter = category ? { where: { category } } : {};
  const prods = await Product.findAll(filter);
  res.render(dest, { prods, dest, query: category });
};

exports.getProduct = async (req, res, next) => {
  const dest = "shop/product";
  const id = req.params.productId;
  const prod = await Product.findByPk(id).catch(console.log);
  if (prod == null) return res.redirect("/shop/").catch(console.log);
  const messages = await prod.getMessages().catch(console);
  res.render(dest, { prod, dest, messages });
};

exports.getFavorites = async (req, res, next) => {
  const dest = "shop/favorites";
  const favorite = await req.user.getFavorite();
  const prods = await favorite.getProducts();
  res.render("shop/favorites", { prods, dest });
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

exports.postMessage = async (req, res, next) => {
  const productId = req.params.productId;
  const content = req.body.content;
  const user = req.user ? req.user.email : "訪客";
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) return res.redirect("/shop/" + productId);
  await prod.createMessage({ content, user }).catch(console.log);
  res.redirect("/shop/" + productId);
};
