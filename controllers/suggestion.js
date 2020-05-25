const Suggestion = require("../models/suggestion.js");

exports.getIndex = async (req, res, next) => {
  const dest = "suggestion/index";
  return res.render(dest, { dest });
};

exports.getSend = async (req, res, next) => {
  const { title, name, content, contact } = req.query;
  await Suggestion.create({
    title,
    name,
    content,
    contact,
  });
  req.flash("hint", "感謝您的建議，將會儘速改善。");
  res.redirect("/");
};
