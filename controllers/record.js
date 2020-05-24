const Record = require("../models/record");
const User = require("../models/user");

exports.transfer = async ({ userId, amount, reason }) => {
  const user = await User.findByPk(userId);
  if (user == null) {
    throw Error("cannot find user");
  }
  user.money += amount;
  await user.save();
  await user.createRecord({
    amount,
    reason,
  });
};

exports.getIndex = async (req, res, next) => {
  const dest = "record/index";
  const records = await req.user.getRecords();
  res.render(dest, { dest, records });
};
