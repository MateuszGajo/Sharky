const next = require("next");
const io = require("socket.io");
const http = require("http");
const express = require("express");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
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
const { client } = require("./config/pgAdaptor");
const { jwtSecret } = require("./config/keys");
const bodyParser = require("body-parser");
const { userJoin, userLeave, getSocket, existUser } = require("./utils/users");

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();

const httpServer = http.createServer(server);
const socketIO = io(httpServer);
server.use(cookieParser());
server.use(bodyParser.json());

socketIO.sockets.on("connection", (socket) => {
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

  socket.on("connectUser", () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    const {
      data: { id: idOwner },
    } = jwt.verify(token, jwtSecret);

    userJoin(idOwner, socket.id);
  });

  socket.on(
    "sendChatMessage",
    ({ idMessage, idChat, idUser, message, date, messageTo }) => {
      const unReadMessageQuery = `update chats set message_to=$1 where id=$2;`;
      if (!existUser(messageTo))
        client.query(unReadMessageQuery, [messageTo, idChat]);
      socket.broadcast.to("chat" + idChat).emit("message", {
        idMessage,
        idChat,
        idUser,
        message,
        date,
        messageTo,
      });
    }
  );

  socket.on("isMessageUnRead", ({ idChat, messageTo }) => {
    const unReadMessageQuery = `update chats set message_to=$1 where id=$2;`;
    client.query(unReadMessageQuery, [messageTo, idChat]);
  });

  socket.on("joinNewChat", async ({ idChat }) => {
    const getUsersQuery = `select id_user_1 as "idUser", id_user_2 as "idOwner" from chats where id=$1`;
    const { rows } = await client.query(getUsersQuery, [idChat]);
    const userSockets = getSocket(rows[0].idUser);
    const ownerSockets = getSocket(rows[0].idOwner);

    const getUserQuery = `select first_name as "firstName", last_name as "lastName",photo from users where id=$1`;
    if (userSockets) {
      const { rows: user } = await client.query(getUserQuery, [rows[0].idUser]);
      for (let i = 0; i < userSockets.length; i++) {
        const soc = socketIO.sockets.connected[userSockets[i]];
        soc.join("chat" + idChat);
        socketIO.to(userSockets[i]).emit("newChat", {
          newChat: {
            ...user[0],
            idChat,
            messageTo: null,
          },
        });
      }
    }

    if (ownerSockets) {
      const { rows: user } = await client.query(getUserQuery, [rows[0].idUser]);
      for (let i = 0; i < ownerSockets.length; i++) {
        const soc = socketIO.sockets.connected[ownerSockets[i]];
        soc.join("chat" + idChat);
        socketIO.to(ownerSockets[i]).emit("newChat", {
          newChat: {
            ...user[0],
            idChat,
            messageTo: null,
          },
        });
      }
    }
  });

  socket.on("joinChat", async () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    const {
      data: { id: idOwner },
    } = jwt.verify(token, jwtSecret);

    const { rows: chats } = await client.query(getChatsQuery, [idOwner]);
    for (let i = 0; i < chats.length; i++) {
      socket.join("chat" + chats[i].idChat);
    }
  });

  socket.on("singleDisconnect", ({ idUser }) => {
    userLeave(idUser, socket.id);
  });

  socket.on("disconnect", async () => {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    if (token) {
      const {
        data: { id: idOwner },
      } = jwt.verify(token, jwtSecret);

      userLeave(idOwner, socket.id);
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
