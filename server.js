// const Koa = require("koa");
const next = require("next");
// const Router = require("koa-router");
const io = require("socket.io");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
// const flash = require("koa-connect-flash");
// const cors = require("@koa/cors");
const authRoute = require("./api/route/auth/authRoute");
require("./config/passportSetup");
// const next = require("next");
// const io = require("socket.io");
// const http = require("http");
const express = require("express");
const nextI18NextMiddleware = require("next-i18next/middleware").default;

const nextI18Next = require("./i18n/server");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = express();

server.use(bodyParser());
server.use(
  session({
    secret: "super-secret-key",
  })
);

server.use(cookieParser());
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());

const httpServer = http.createServer(server);
const socketIO = io(httpServer);

(async () => {
  await app.prepare();

  await nextI18Next.initPromise;
  server.use(nextI18NextMiddleware(nextI18Next));

  server.use("/auth", authRoute);

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(process.env.PORT || 3000);
})();
