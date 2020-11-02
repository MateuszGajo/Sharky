const next = require("next");
const io = require("socket.io");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoute = require("./api/route/auth/authRoute");
require("./config/passportSetup");
const express = require("express");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
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
const { client } = require("./config/pgAdaptor");
const { userJoin, userLeave, getSocket, existUser } = require("./utils/users");
const decodeToken = require("./utils/decodeToken");

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();

server.use(bodyParser({ extended: false }));
server.use(bodyParser.json());
server.use(
  session({
    secret: "super-secret-key",
    cookie: { maxAge: 60000 },
  })
);
server.use(cookieParser());

server.use(passport.initialize());
server.use(passport.session());

const httpServer = http.createServer(server);
const socketIO = io(httpServer);
server.use(cookieParser());
server.use(bodyParser.json());

socketIO.sockets.on("connection", (socket) => {
  const addUnreadMessageQuery = fs
    .readFileSync(path.join(__dirname, "./utils/query/add/unreadMessage.sql"))
    .toString();
  socket.on("connectUser", () => {
    const { id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );
    if (ownerId) userJoin(ownerId, socket.id);
  });

  socket.on("sendChatMessage", async ({ userId, message }) => {
    const { id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );

    if (/^[\d]*$/.test(userId) && message && ownerId) {
      const addMessageQuery = fs
        .readFileSync(
          path.join(__dirname, "./api/route/message/query/add/message.sql")
        )
        .toString();
      const date = new Date();

      const { rows, rowCount } = await client.query(addMessageQuery, [
        message,
        date,
        ownerId,
        userId,
      ]);
      if (rowCount > 0) {
        if (!existUser(userId))
          client.query(addUnreadMessageQuery, [userId, ownerId]);
        socketIO.in("chat" + rows[0].chatId).emit("message", {
          chatId: rows[0].chatId,
          messageId: rows[0].id,
          userId: ownerId,
          message,
          date,
        });
      }
    }
  });

  socket.on("isMessageUnRead", ({ userId }) => {
    const { id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );
    if (ownerId) client.query(addUnreadMessageQuery, [ownerId, userId]);
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
    const { id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );

    const getChatsQuery = fs
      .readFileSync(
        path.join(__dirname, "./api/route/friend/query/get/chats.sql")
      )
      .toString();
    if (ownerId) {
      const { rows: chats } = await client.query(getChatsQuery, [ownerId]);
      for (let i = 0; i < chats.length; i++) {
        socket.join("chat" + chats[i].chatId);
      }
    }
  });

  socket.on("singleDisconnect", () => {
    const { id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );
    if (ownerId) {
      userLeave(ownerId, socket.id);
    }
  });

  socket.on("disconnect", async () => {
    const { id: ownerId } = decodeToken(
      cookie.parse(socket.handshake.headers.cookie).token
    );
    if (ownerId) {
      userLeave(ownerId, socket.id);
    }
  });
});

(async () => {
  await app.prepare();

  await nextI18Next.initPromise;
  server.use(nextI18NextMiddleware(nextI18Next));

  server.use("/auth", authRoute);
  server.use("/comment", commentRoute);
  server.use("/reply", replyRoute);
  server.use("/post", postRoute);
  server.use("/user", userRoute);
  server.use("/friend", friendRoute);
  server.use("/people", peopleRoute);
  server.use("/message", messageRoute);
  server.use("/group", groupRoute);
  server.use("/fanpage", fanpageRoute);
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(process.env.PORT || 3000);
})();
