const next = require("next");
const io = require("socket.io");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("flash");
const authRoute = require("./api/route/auth/authRoute");
require("./config/passportSetup");
const express = require("express");
const nextI18NextMiddleware = require("next-i18next/middleware").default;

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
