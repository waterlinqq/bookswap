const socketIO = require("socket.io");
const Chat = require("./models/chat");
const crypto = require("crypto");

const md5 = crypto.createHash("md5");
let io;

exports.init = (server) => {
  io = socketIO(server);
};
exports.establish = (chatId) => {
  const namespace = "/" + chatId;
  if (io.nsps[namespace]) {
    return;
  }
  const newIo = io.of(namespace).on("connection", (socket) => {
    socket.on("clientSend", async ({ content, from, to }) => {
      const chat = await Chat.create({
        from,
        to,
        content,
        chatId,
      });
      newIo.emit("serverSend", chat);
    });
  });
};
