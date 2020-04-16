const Product = require("../models/product");
const Favorites = require("../models/favorites");
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

exports.getFavoriteProducts = async (req, res, next) => {
  const products = await Product.getAll();
  const favorites = await Favorites.getAll();
  const prods = favorites.map((fav) =>
    products.find((prod) => prod.id === fav.id)
  );
  res.render("shop/favorites", { prods });
};

exports.postFavoriteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  new Favorites(prodId).save();
  res.redirect("/shop/favorites");
};
