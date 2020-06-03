const Product = require("../models/product");
const User = require("../models/user");
const { Op } = require("sequelize");
// const Favorites = require("../models/favorite");

exports.getIndex = async (req, res, next) => {
  const dest = "shop/index";
  const { category } = req.query;
  const filter = { where: { state: "0" } };
  if (category) {
    filter.where.category = category;
  }
  const prods = await Product.findAll(filter);
  res.render(dest, { prods, dest, query: category });
};

exports.getProduct = async (req, res, next) => {
  const dest = "shop/product";
  const id = req.params.productId;
  const prod = await Product.findByPk(id).catch(console.log);
  if (prod == null) return res.redirect("/shop/").catch(console.log);
  const messages = await prod
    .getMessages({
      include: [{ model: User, attributes: ["email", "id"] }],
    })
    .catch(console.log);
  const user = await prod.getUser();
  res.render(dest, { prod, dest, messages, seller: user });
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
  const userId = req.user ? req.user.id : "";
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) return res.redirect("/shop/" + productId);
  await prod.createMessage({ content, userId }).catch(console.log);
  res.redirect("/shop/" + productId);
};

exports.postSearch = async (req, res, next) => {
  const dest = "shop/index";
  const { keyword } = req.body;

  const option = {
    where: {
      state: "0",
      [Op.or]: {
        title: { [Op.like]: "%" + keyword + "%" },
        author: { [Op.like]: "%" + keyword + "%" },
      },
    },
  };
  if (!isNaN(Number(keyword)) && keyword.length > 8) {
    option.where[Op.or].isbn = { [Op.like]: "%" + keyword + "%" };
  }
  const prods = await Product.findAll(option);
  res.render(dest, { prods, dest });
};
