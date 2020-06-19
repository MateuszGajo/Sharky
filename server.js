const next = require("next");
const io = require("socket.io");
const http = require("http");
const express = require("express");
const nextI18NextMiddleware = require("next-i18next/middleware").default;
const commentRoute = require("./api/route/comment/commentRoute");
const replyRoute = require("./api/route/reply/replyRoute");
const bodyParser = require("body-parser");

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();
server.use(bodyParser.json());

const httpServer = http.createServer(server);
const socketIO = io(httpServer);

(async () => {
  await app.prepare();

  await nextI18Next.initPromise;
  server.use(nextI18NextMiddleware(nextI18Next));

  server.get("*", (req, res) => {
    server.use("/comment", commentRoute);
    server.use("/reply", replyRoute);
    handle(req, res);
  });

  httpServer.listen(process.env.PORT || 3000);
})();
