const next = require("next");
const io = require("socket.io");
const http = require("http");
const express = require("express");
const expsession = require("express-session");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const jwt = require("jsonwebtoken");
const commentRoute = require("./api/route/comment/commentRoute");
const replyRoute = require("./api/route/reply/replyRoute");
const postRoute = require("./api/route/post/postRoute");
const userRoute = require("./api/route/user/userRoute");
const friendRoute = require("./api/route/friend/friendRoute");
const messageRoute = require("./api/route/message/messageRoute");
const { client } = require("./config/pgAdaptor");
const { jwtSecret } = require("./config/keys");
const bodyParser = require("body-parser");
const { expressSessionSecret } = require("./config/keys");

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();

const httpServer = http.createServer(server);
const socketIO = io(httpServer);

server.use(bodyParser.json());

socketIO.sockets.on("connection", (socket) => {
  socket.on("sendChatMessage", ({ idChat, message, date }) => {
    socket.broadcast.to(idChat).emit("message", { message, date, idChat });
  });

  socket.on("joinChat", async () => {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: {
          id: 1,
        },
      },
      jwtSecret
    );
    if (token) {
      const {
        data: { id: idUser },
      } = jwt.verify(token, jwtSecret);
      const getChatsQuery = `
          select  chats.id as "idChat"
      from(select id_user_1 
            from friends 
            where id_user_2=$1
            union
            select id_user_2
            from friends 
            where id_user_1=$1) as result
      inner join chats on chats.id_user_1 = result.id_user_1 or chats.id_user_2 = result.id_user_1
      left join users on users.id = result.id_user_1`;

      const { rows: chats } = await client.query(getChatsQuery, [idUser]);
      for (let i = 0; i < chats.length; i++) {
        socket.join(chats[i].idChat);
      }
    }
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
