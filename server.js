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
const jwt = require("jsonwebtoken");
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
const notificationRoute = require("./api/route/notifications/notificationsRoute");
const countryRoute = require("./api/route/country/countryRoute");
const languageRoute = require("./api/route/language/languageRoute");
const { client } = require("./config/pgAdaptor");
const { jwtSecret } = require("./config/keys");
const { userJoin, userLeave, getSocket, existUser } = require("./utils/users");
const { getChatsQuery } = require("./api/route/friend/query");

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

socketIO.sockets.on("connection", (socket) => {
  socket.on("connectUser", () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    const {
      data: { id: onwerId },
    } = jwt.verify(token, jwtSecret);
    userJoin(onwerId, socket.id);
  });

  socket.on(
    "sendChatMessage",
    ({ messageId, chatId, userId, message, date, messageTo }) => {
      const unReadMessageQuery = `update chats set message_to=$1 where id=$2;`;
      if (!existUser(messageTo))
        client.query(unReadMessageQuery, [messageTo, chatId]);
      socket.broadcast.to("chat" + chatId).emit("message", {
        messageId,
        chatId,
        userId,
        message,
        date,
        messageTo,
      });
    }
  );

  socket.on("isMessageUnRead", ({ chatId, messageTo }) => {
    const unReadMessageQuery = `update chats set message_to=$1 where id=$2;`;
    client.query(unReadMessageQuery, [messageTo, chatId]);
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

  socket.on("changedPassword", async ({ userId }) => {
    const sockets = getSocket(userId);
    for (let i = 0; i < sockets.length; i++) {
      socketIO.to(sockets[i]).emit("logOutChangedPassword");
    }
  });

  socket.on("joinChat", async () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    const {
      data: { id: onwerId },
    } = jwt.verify(token, jwtSecret);

    const { rows: chats } = await client.query(getChatsQuery, [onwerId]);
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
        data: { id: onwerId },
      } = jwt.verify(token, jwtSecret);

      userLeave(onwerId, socket.id);
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
  server.use("/news", newsRoute);
  server.use("/notification", notificationRoute);
  server.use("/country", countryRoute);
  server.use("/language", languageRoute);
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(process.env.PORT || 3000);
})();
