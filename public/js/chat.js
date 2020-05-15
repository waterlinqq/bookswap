const text = document.querySelector("#text");
const messages = document.querySelector("#messages");
const chatId = document.querySelector("#chatid").value;
const from = document.querySelector("#from").value;
const to = document.querySelector("#to").value;
const socket = io("/" + chatId);
messages.lastChild.scrollIntoView();
socket.on("serverSend", (chat) => {
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.innerText = chat.content;
  div.title = chat.createdAt;
  div.className = chat.from == from ? "right" : "left";
  div.appendChild(p);
  messages.appendChild(div);
  messages.lastChild.scrollIntoView();
});

text.addEventListener("keypress", (e) => {
  if (e.keyCode !== 13) return;
  e.preventDefault();
  const content = text.value;
  if (content.trim() === "") return;

  socket.emit("clientSend", { content, from, to });
  text.value = "";
});
