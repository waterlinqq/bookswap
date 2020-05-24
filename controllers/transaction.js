const { Op } = require("sequelize");

const Product = require("../models/product");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const { transfer } = require("./record");

exports.getOrder = async (req, res, next) => {
  const dest = "transaction/order";
  const productId = req.params.productId;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) {
    req.flash("hint", "查無此商品");
    return res.redirect("/shop/");
  }
  const seller = await prod.getUser().catch(console.log);
  res.render("transaction/order", { prod, seller, dest });
};

exports.postOrder = async (req, res, next) => {
  const productId = req.params.productId;
  const { delivery, place, time, mark } = req.body;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) {
    req.flash("hint", "查無此商品");
    return res.redirect("/shop/");
  }
  if (req.user.money < prod.price) {
    req.flash("hint", "換幣不足");
    return res.redirect("/shop/");
  }
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
  prod.state = "1";
  await prod.save();
  req.flash("hint", "請等待賣家同意");
  res.redirect("/transaction/");
};

exports.getOrder = async (req, res, next) => {
  const dest = "transaction/order";
  const productId = req.params.productId;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) {
    req.flash("hint", "查無此商品");
    return res.redirect("/shop/");
  }
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

exports.getOrderDetail = async (req, res, next) => {
  let dest;
  const transactionId = req.params.transactionId;
  const tran = await Transaction.findByPk(transactionId, {
    include: [
      {
        model: User,
        as: "seller",
        attributes: ["email"],
      },
      {
        model: User,
        as: "buyer",
        attributes: ["email"],
      },
      {
        model: Product,
        attributes: ["title"],
      },
    ],
  });
  if (tran == null) {
    req.flash("hint", "查無此筆交易");
    return res.redirect("/transaction/");
  }
  if (tran.buyerId == req.user.id) {
    dest = "transaction/order-sent";
  } else if (tran.sellerId == req.user.id) {
    dest = "transaction/order-recieved";
  } else {
    req.flash("hint", "請勿更改交易資訊");
    return res.redirect("/transaction/");
  }
  res.render(dest, { tran, dest });
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

exports.postCancel = async (req, res, next) => {
  const transactionId = req.params.transactionId;
  const tran = await Transaction.findByPk(transactionId);
  if (tran == null) {
    req.flash("hint", "查無此筆交易");
    return res.redirect("/transaction/");
  }
  if (tran.sellerId == req.user.id) {
    tran.state = "4";
  } else if (tran.buyerId == req.user.id) {
    tran.state = "3";
  } else {
    req.flash("hint", "請勿更改交易資訊");
    return res.redirect("/transaction/");
  }
  const prod = await tran.getProduct();
  prod.state = "0";
  await prod.save();
  await tran.save();
  req.flash("hint", "交易已取消");
  res.redirect("/transaction");
};

exports.postAgree = async (req, res, next) => {
  const { transactionId } = req.params;
  const [tran] = await req.user.getSell({ where: { id: transactionId } });
  if (tran == null) {
    req.flash("hint", "查無此筆交易");
    return res.redirect("/transaction/");
  }
  tran.state = "1";
  await tran.save();
  req.flash("hint", "已經同意訂單，完成交易後等待買家完成訂單");
  res.redirect("/transaction/");
};

exports.postFinish = async (req, res, next) => {
  const { transactionId } = req.params;
  const [tran] = await req.user.getBuy({ where: { id: transactionId } });
  if (tran == null) {
    req.flash("hint", "查無此筆交易");
    return res.redirect("/transaction/");
  }
  const prod = await tran.getProduct();
  prod.state = "2";
  tran.state = "2";
  await tran.save();
  await prod.save();
  transfer({
    userId: tran.buyerId,
    amount: -tran.price,
    reason: `商品交易，代號：${tran.productId}`,
  });
  transfer({
    userId: tran.sellerId,
    amount: tran.price,
    reason: `商品交易，代號：${tran.productId}`,
  });
  req.flash("hint", "恭喜你完成交易");
  res.redirect("/transaction/");
};
