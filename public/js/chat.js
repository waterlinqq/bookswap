const text = document.querySelector("#text");
const messagesContainer = document.querySelector("#message-container");
const chatId = document.querySelector("#chatid").value;
const from = document.querySelector("#from").value;
const to = document.querySelector("#to").value;
const socket = io("/" + chatId);
if (messagesContainer.lastElementChild) {
  messagesContainer.lastElementChild.scrollIntoView();
}

const createTempleteFrom = (chat) => `
  <div class="row my-3">
    <div class="col-8 ml-auto text-right">
      <div class="d-inline-block">
        <p class="px-2 py-1 mb-1 rounded bg-info text-white content d-inline-block text-left">
          ${chat.content}
        </p>
        <small class="date trimText text-small text-muted">
          ${chat.createdAt}
        </small>
      </div>
    </div>
  </div>
`;
const createTempleteTo = (chat) => `
  <div class="row my-3">
      <div class="col-8 mr-auto">
        <div class="d-flex text-left">
          <img class="mr-3 rounded-circle" height="35" width="35" src="/system/default-user.jpg">
          <div class="d-inline-block">
            <p class="px-2 py-1 mb-1 rounded bg-light-gray content d-inline-block">
              ${chat.content}
            </p>
            <small class="date trimText font-small text-muted">
              ${chat.createdAt}
            </small>
          </div>
        </div>
      </div>
    </div>
`;

socket.on("serverSend", (chat) => {
  let template;
  if (chat.from == from) {
    template = createTempleteFrom(chat);
  } else {
    template = createTempleteTo(chat);
  }
  messagesContainer.insertAdjacentHTML("beforeend", template);
  messagesContainer.lastElementChild.scrollIntoView();
});

text.addEventListener("keypress", (e) => {
  if (e.keyCode !== 13) return;
  e.preventDefault();
  const content = text.value;
  if (content.trim() === "") return;

  socket.emit("clientSend", { content, from, to });
  text.value = "";
});
