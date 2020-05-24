const { establish } = require("../socket.js");
const sequelize = require("sequelize");
const Chat = require("../models/chat");
const User = require("../models/user");
const crypto = require("crypto");

exports.getRecent = async (req, res, next) => {
  const fromMsgs = await Chat.findAll({
    include: [{ model: User, as: "sendBy", attributes: ["email", "id"] }],
    where: {
      to: req.user.id,
    },
    group: "from",
  }).catch(console.log);
  const toMsgs = await Chat.findAll({
    include: [{ model: User, as: "recievedBy", attributes: ["email", "id"] }],
    where: {
      from: req.user.id,
    },
    group: "to",
  }).catch(console.log);
  const sortedMsgs = [...fromMsgs, ...toMsgs].sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );
  const set = new Set();
  const deduplicatedMsgs = sortedMsgs.filter((msg) => {
    const mateId = msg.from == +req.user.id ? msg.to : msg.from;
    if (set.has(mateId)) {
      return false;
    } else {
      set.add(mateId);
      return true;
    }
  });
  res.locals.recent = deduplicatedMsgs;
  next();
};
exports.getChat = async (req, res, next) => {
  const dest = "chat/index";
  const userId = req.params.userId;
  const mate = await User.findByPk(userId);
  if (mate == null) {
    return res.redirect("/chat");
  }
  const chatUsers = [req.user.id, userId].sort().join("-");
  const md5 = crypto.createHash("md5");
  const chatId = md5.update(chatUsers).digest("hex");
  establish(chatId);
  const chats = await Chat.findAll({ where: { chatId } });
  res.render(dest, { chatId, dest, chats, userId, mate });
};

exports.getIndex = async (req, res, next) => {
  const dest = "chat/list";
  return res.render(dest, { dest });
};
