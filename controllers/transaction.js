const { Op } = require("sequelize");

const Product = require("../models/product");
const User = require("../models/user");
const Transaction = require("../models/transaction");

exports.getOrder = async (req, res, next) => {
  const dest = "transaction/order";
  const productId = req.params.productId;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) return res.redirect("/shop/");
  const seller = await prod.getUser().catch(console.log);
  res.render("transaction/order", { prod, seller, dest });
};

exports.postOrder = async (req, res, next) => {
  const productId = req.params.productId;
  const { delivery, place, time, mark } = req.body;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) return res.redirect("/shop/");
  const seller = await prod.getUser().catch(console.log);
  await Transaction.create({
    productId: prod.id,
    price: prod.price,
    buyerId: req.user.id,
    sellerId: seller.id,
    delivery,
    place,
    time,
    mark,
    state: 0,
  }).catch(console.log);
  res.redirect("/transaction/");
};

exports.getOrder = async (req, res, next) => {
  const dest = "transaction/order";
  const productId = req.params.productId;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) return res.redirect("/shop/");
  const seller = await prod.getUser().catch(console.log);
  res.render("transaction/order", { prod, seller, dest });
};

exports.getSell = async (req, res, next) => {
  const dest = "transaction/buysell";
  const trans = await req.user
    .getSell({
      include: [
        {
          model: Product,
          attributes: ["title", "author", "url"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["email"],
        },
      ],
    })
    .catch(console.log);
  res.render(dest, { trans, dest, sub: "sell" });
};

exports.getBuy = async (req, res, next) => {
  const dest = "transaction/buysell";
  const trans = await req.user
    .getBuy({
      include: [
        {
          model: Product,
          attributes: ["title", "author", "url"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["email"],
        },
      ],
    })
    .catch(console.log);
  res.render(dest, { trans, dest, sub: "buy" });
};

exports.getIndex = async (req, res, next) => {
  const dest = "transaction/buysell";
  const buys = await req.user.getBuy({
    include: [
      {
        model: Product,
        attributes: ["title", "author", "url"],
      },
      {
        model: User,
        as: "seller",
        attributes: ["email"],
      },
    ],
  });
  const sells = await req.user
    .getSell({
      include: [
        {
          model: Product,
          attributes: ["title", "author", "url"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["email"],
        },
      ],
    })
    .catch(console.log);
  const trans = buys
    .concat(sells)
    .sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
  res.render(dest, { trans, dest, sub: "index" });
};
