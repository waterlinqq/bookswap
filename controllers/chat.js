const { establish } = require("../socket.js");
const Chat = require("../models/chat");
const crypto = require("crypto");

exports.getChat = async (req, res, next) => {
  const dest = "chat/index";
  const userId = req.params.userId;
  const chatUsers = [req.user.id, userId].sort().join("-");
  const md5 = crypto.createHash("md5");
  const chatId = md5.update(chatUsers).digest("hex");
  establish(chatId);
  const chats = await Chat.findAll({ where: { chatId } });
  res.render(dest, { chatId, dest, chats, userId });
};
