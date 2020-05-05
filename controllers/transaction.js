const Product = require("../models/product");

exports.getBuy = async (req, res, next) => {
  const dest = "transaction/buy";
  const productId = req.params.productId;
  const prod = await Product.findByPk(productId).catch(console.log);
  if (prod == null) return res.redirect("/shop/");
  const seller = await prod.getUser().catch(console.log);
  res.render("transaction/buy", { prod, seller, dest });
};
