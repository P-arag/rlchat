const socket = io();
const message = document.getElementById("msg");
let leave = document.getElementById("leave");
const username = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username.username);
socket.emit("joinRoom", { username: username.username, room: username.room });
console.log(username.username);
const name = username.username;
let usersList = document.querySelector("#users");
let chatMessages = document.querySelector(".chat-messages");
let usernameForTheUserWhoLeftTheChat = username.username;
leave.addEventListener("click", () => {
  socket.emit("disconnect", username.username);
  window.location.href = "index.html";
});
socket.emit("new-user-joined", name);
append("Rl Chat", "Welcome to the chat app , Developer:- Parag", "Just now");
document.getElementById("send").addEventListener("click", (e) => {
  e.preventDefault();
  let msg = message.value;
  if (msg != "") {
    socket.emit("sent", name, msg);
    message.value = "";
    message.focus();
  }
});

// All socket.on connections
socket.on("user-for-everyone-to-see", (data) => {
  append(data.from, data.message, data.createdAt);
});
socket.on("user-joined", (n) => {
  const li = document.createElement("li");
  const text = document.createTextNode(n);
  li.appendChild(text);
  usersList.appendChild(li);
});

socket.on("roomJoined", (r) => {
  console.log(r.name);
  console.log(r.id);
});
socket.on("received", (data) => {
  append(data.from, data.message, data.createdAt);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
socket.on("disconnection", (data) => {
  append(data.from, data.message, data.createdAt);
});
// The Functions
function append(name, msg, date) {
  let container = document.getElementById("msgCont");
  let data = document.createElement("div");
  data.setAttribute("class", "message");
  let sentBy = document.createElement("p");
  sentBy.setAttribute("class", "meta");
  sentBy.innerText = name;
  let time = document.createElement("span");
  time.innerText = `${date} `;
  sentBy.append(time);
  data.append(sentBy);
  let message = document.createElement("p");
  message.setAttribute("class", "text");
  message.innerText = msg;
  data.append(message);
  container.append(data);
}
