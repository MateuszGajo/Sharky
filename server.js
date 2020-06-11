// const Koa = require("koa");
const next = require("next");
// const Router = require("koa-router");
const io = require("socket.io");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("flash");
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

server.use(bodyParser({ extended: false }));
server.use(bodyParser.json());
server.use(
  session({
    secret: "super-secret-key",
    cookie: { maxAge: 60000 },
  })
);

server.use(cookieParser());
server.use(flash());
server.use((req, res, next) => {
  req.flash = (key, value) => {
    if (value) {
      if (!req.session.flash) req.session.flash = {};

      req.session.flash[key] = value;
    } else {
      return res.locals.flash[key];
    }
  };

  res.locals.flash = req.session.flash || {};
  delete req.session.flash;

  next();
});
server.use(passport.initialize());
server.use(passport.session());

// server.use(function (req, res, next) {
//   req.flash("error", "dfassda");
//   next();
// });

server.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

// const httpServer = http.createServer(server);
// const socketIO = io(httpServer);

(async () => {
  await app.prepare();

  await nextI18Next.initPromise;
  server.use(nextI18NextMiddleware(nextI18Next));

  server.use("/auth", authRoute);

  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(3000);

  // httpServer.listen(process.env.PORT || 3000);
})();
