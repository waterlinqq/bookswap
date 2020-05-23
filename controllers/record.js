const Record = require("../models/record");
exports.getIndex = async (req, res, next) => {
  const dest = "record/index";
  const records = await req.user.getRecords();
  res.render(dest, { dest, records });
};
