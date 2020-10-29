const next = require("next");
const io = require("socket.io");
const http = require("http");
const express = require("express");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const commentRoute = require("./api/route/comment/commentRoute");
const replyRoute = require("./api/route/reply/replyRoute");
const postRoute = require("./api/route/post/postRoute");
const userRoute = require("./api/route/user/userRoute");
const friendRoute = require("./api/route/friend/friendRoute");
const peopleRoute = require("./api/route/people/peopleRoute");
const messageRoute = require("./api/route/message/messageRoute");
const groupRoute = require("./api/route/group/groupRoute");
const fanpageRoute = require("./api/route/fanpage/fanpageRoute");
const newsRoute = require("./api/route/news/newsRoute");
const { client } = require("./config/pgAdaptor");
const { jwtSecret } = require("./config/keys");
const bodyParser = require("body-parser");
const { userJoin, userLeave, getSocket, existUser } = require("./utils/users");
const decodeToken = require("./utils/decodeToken");

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();

const httpServer = http.createServer(server);
const socketIO = io(httpServer);
server.use(cookieParser());
server.use(bodyParser.json());

socketIO.sockets.on("connection", (socket) => {
  const addUnreadMessageQuery = fs
    .readFileSync(path.join(__dirname, "./utils/query/add/unreadMessage.sql"))
    .toString();
  socket.on("connectUser", () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    const {
      data: { id: ownerId },
    } = jwt.verify(token, jwtSecret);
    userJoin(ownerId, socket.id);
  });

  socket.on("sendChatMessage", ({ messageId, userId, message, date }) => {
    const { error, id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );
    if (error) return;

    if (!existUser(messageTo))
      client.query(addUnreadMessageQuery, [userId, ownerId]);
    socket.broadcast.to("chat" + chatId).emit("message", {
      messageId,
      userId: ownerId,
      message,
      date,
    });
  });

  socket.on("isMessageUnRead", ({ userId }) => {
    const { error, id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );
    if (error) return;
    client.query(addUnreadMessageQuery, [userId, ownerId]);
  });

  socket.on("joinNewChat", async ({ friendshipId, chatId }) => {
    const getUsersQuery = `select user_id_1 as "firstUser", user_id_2 as "secondUser" from friends where id=$1`;
    const { rows } = await client.query(getUsersQuery, [friendshipId]);

    const userSockets = getSocket(rows[0].firstUser);
    const ownerSockets = getSocket(rows[0].secondUser);

    const getUserQuery = `select first_name as "firstName", last_name as "lastName",photo from users where id=$1`;
    if (userSockets) {
      const { rows: user } = await client.query(getUserQuery, [
        rows[0].secondUser,
      ]);
      for (let i = 0; i < userSockets.length; i++) {
        const soc = socketIO.sockets.connected[userSockets[i]];
        soc.join("chat" + chatId);
        socketIO.to(userSockets[i]).emit("newChat", {
          newChat: {
            ...user[0],
            chatId,
            messageTo: null,
          },
        });
      }
    }

    if (ownerSockets) {
      const { rows: user } = await client.query(getUserQuery, [
        rows[0].firstUser,
      ]);
      for (let i = 0; i < ownerSockets.length; i++) {
        const soc = socketIO.sockets.connected[ownerSockets[i]];
        soc.join("chat" + chatId);
        socketIO.to(ownerSockets[i]).emit("newChat", {
          newChat: {
            ...user[0],
            chatId,
            messageTo: null,
          },
        });
      }
    }
  });

  socket.on("joinChat", async () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    const {
      data: { id: ownerId },
    } = jwt.verify(token, jwtSecret);

    const getChatsQuery = fs
      .readFileSync(
        path.join(__dirname, "./api/route/friend/query/get/chats.sql")
      )
      .toString();

    const { rows: chats } = await client.query(getChatsQuery, [ownerId]);
    for (let i = 0; i < chats.length; i++) {
      socket.join("chat" + chats[i].chatId);
    }
  });

  socket.on("singleDisconnect", ({ userId }) => {
    userLeave(userId, socket.id);
  });

  socket.on("disconnect", async () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    if (token) {
      const {
        data: { id: ownerId },
      } = jwt.verify(token, jwtSecret);

      userLeave(ownerId, socket.id);
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
  server.use("/people", peopleRoute);
  server.use("/message", messageRoute);
  server.use("/group", groupRoute);
  server.use("/fanpage", fanpageRoute);
  server.use("/news", newsRoute);
  server.get("*", (req, res) => {
    handle(req, res);
  });

  httpServer.listen(process.env.PORT || 3000);
})();
