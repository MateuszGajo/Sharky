const next = require("next");
const io = require("socket.io");
const http = require("http");
const express = require("express");
const expsession = require("express-session");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const commentRoute = require("./api/route/comment/commentRoute");
const replyRoute = require("./api/route/reply/replyRoute");
const postRoute = require("./api/route/post/postRoute");
const userRoute = require("./api/route/user/userRoute");
const friendRoute = require("./api/route/friend/friendRoute");
const messageRoute = require("./api/route/message/messageRoute");
const bodyParser = require("body-parser");
const { expressSessionSecret } = require("./config/keys");

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();

const httpServer = http.createServer(server);
const socketIO = io(httpServer);

server.use(bodyParser.json());

const sessionMiddleware = expsession({
  secret: expressSessionSecret,
  saveUninitialized: true,
  resave: true,
});
server.use(sessionMiddleware);

server.use((req, res, next) => {
  req.io = socketIO;
  next();
});

socketIO.sockets.on("connection", (socket) => {
  console.log("połączone w serwerze");
  socket.on("sendChatMessage", ({ idChat, message, date }) => {
    socket.request.session.socketio = socket.id;
    socket.broadcast.to("room").emit("message", { message, date, idChat });
  });

  socket.on("joinChat", ({ idChat }) => {
    console.log("joinujemy");
    socket.join(idChat);
  });

  socket.request.session.socketio = socket.id;
  socket.request.session.save();
});

server.post("/friend/chat/join", (req, res) => {
  const { users } = req.body;
  // const { io } = req;
  const session = req.session;
  console.log(session);
  console.log("robimy nasłuchiwanie");
  // console.log(socketIO.sockets.connected[session.socketio]);
  //console.log(socketIO.sockets.connected[session.socketio]);

  // socketIO.sockets.connected[session.socketio].join("room");

  // const { io } = req;
  // io.on("connect", (socket) => {
  //   console.log("połączone");
  // });
  // for (let i = 0; i < users.length; i++) {
  //   // io.join("room");
  // }
  res.status(200);
  // console.log(Server.socket.adapter.rooms[2]);
});

// socketIO.local.emit("chat", 2);
(async () => {
  await app.prepare();

  await nextI18Next.initPromise;
  server.use(nextI18NextMiddleware(nextI18Next));

  socketIO.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  server.use("/comment", commentRoute);
  server.use("/reply", replyRoute);
  server.use("/post", postRoute);
  server.use("/user", userRoute);
  server.use("/friend", friendRoute);
  server.use("/message", messageRoute);
  server.get("*", (req, res) => {
    handle(req, res);
  });

  httpServer.listen(process.env.PORT || 3000);
})();
