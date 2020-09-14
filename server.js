const express = require("express");
const app = express();
const moment = require("moment");
const path = require("path");
const { v4: uuid } = require("uuid");
let room = uuid();
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = socketIO(server);
const staticPath = path.join(__dirname + "/public");
console.log(PORT);
app.use(express.static(staticPath));
// Own Code
const users = [];
function userJoin(id, username, room) {
  let user = { id, username, room };
  users.push(user);
  return user;
}
function getCurrentUser(id) {
  return users.find((user) => {
    user.id === id;
  });
}
io.on("connection", (socket) => {
  socket.on("joinRoom", (name) => {
    console.log("listened");
    io.emit("roomJoined", {
      name: name.username,
      id: name.room,
    });
    // console.log(name.room);
    const user = userJoin(socket.id, name.username, name.room);
    socket.join(user.room);
    console.log(user.room);
    socket.on("new-user-joined", (name) => {
      // users.push(name);
      let notDate = new Date();
      let date = moment(notDate).format("LT");
      let adminData = {
        from: "Rl Chat",
        message: `${name} joined the chat`,
        createdAt: date,
      };
      io.to(user.room).emit("user-joined", name);
      socket.broadcast
        .to(user.room)
        .emit("user-for-everyone-to-see", adminData);
    });
    socket.on("sent", (n, m) => {
      console.log(`${n} ${m}`);
      let notDate = new Date();
      let date = moment(notDate).format("LT");
      let data = {
        from: n,
        message: m,
        createdAt: date,
      };
      io.to(user.room).emit("received", data);
    });
    socket.on("disconnect", (name) => {
      console.log(name);
      let notDate = new Date();
      let date = moment(notDate).format("LT");
      let data = {
        from: "Rl Chat",
        message: `${name} has left the chat`,
        createdAt: date,
      };
      io.to(user.room).emit("disconnection", data);
      console.log(data);
    });
  });
  console.log("New Connection Made");
});
// Own code\\
console.log(users);
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
