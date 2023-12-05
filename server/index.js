// const cors = require("cors");
// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// app.use(cors());
// const io = require("socket.io")(http);
// io.use(cors());

const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: true,
});

const email_ToSocketMap = new Map();
const socket_ToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected!`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    email_ToSocketMap.set(email, socket.id);
    socket_ToEmailMap.set(socket.id, email);
    io.to(room).emit(`user:joined`, { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:negotiation:needed", ({ to, offer }) => {
    io.to(to).emit("peer:negotiation:needed", { from: socket.id, offer });
  });

  socket.on("peer:negotiation:done", ({ to, ans }) => {
    io.to(to).emit("peer:negotiation:final", { from: socket.id, ans });
  });
});

// // Start the server
// const PORT = process.env.PORT || 8000;
// http.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
