const Product = require("../models/product");
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
    price: prod.id,
    buyer: req.user.id,
    seller: seller.id,
    delivery,
    place,
    time,
    mark,
    state: 0,
  });
  res.redirect("/transaction/");
};

exports.getIndex = async (req, res, next) => {};
