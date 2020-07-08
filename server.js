const next = require("next");
const io = require("socket.io");
const http = require("http");
const express = require("express");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const commentRoute = require("./api/route/comment/commentRoute");
const replyRoute = require("./api/route/reply/replyRoute");
const postRoute = require("./api/route/post/postRoute");
const userRoute = require("./api/route/user/userRoute");
const friendRoute = require("./api/route/friend/friendRoute");
const messageRoute = require("./api/route/message/messageRoute");
const bodyParser = require("body-parser");
const router = express.Router();

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();
server.use(bodyParser.json());

const httpServer = http.createServer(server);
const socketIO = io(httpServer);

socketIO.sockets.on("connection", (socket) => {
  socket.on("chat", (id) => {
    console.log(id);
    console.log("joining room");
    socket.join(id);
  });

  socket.on("sendChatMessage", ({ chat, message, date }) => {
    console.log(chat);
    console.log("wiadomośc wysłana");
    // socket.broadcast.to(chat).emit("message", { message, date });
    socketIO.sockets.in(chat).emit("message", { message, date });
  });

  socket.on("disconnect", () => {
    // socket.leave()
  });
});

(async () => {
  await app.prepare();

  await nextI18Next.initPromise;
  server.use(nextI18NextMiddleware(nextI18Next));
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
