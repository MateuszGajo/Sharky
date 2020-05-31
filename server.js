const Koa = require("koa");
const next = require("next");
const Router = require("koa-router");
const io = require("socket.io");
const http = require("http");
const passport = require("koa-passport");
const session = require("koa-session");
const bodyParser = require("koa-bodyparser");
const flash = require("koa-connect-flash");
require("./api/route/auth/authRoute");
require("./config/passportSetup");

const router = Router();

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = new Koa();

server.use(bodyParser());
server.keys = ["super-secret-key"];
server.use(session(server));
server.use(flash());

server.use(passport.initialize());
server.use(passport.session());

const httpServer = http.createServer(server.callback());
const socketIO = io(httpServer);

(async () => {
  await app.prepare();
  // router.get("/auth", authRoutes);
  router.get("/auth/facebook", function (req, res, next) {
    passport.authenticate("facebook", function (err, user, info) {
      console.log(info);
      if (err) {
        console.log("db error");
        return next(err);
      }
      if (!user) {
        console.log("authen failes");
        return res.send({ success: false, message: "authentication failed" });
      }
      console.log("good");
      return res.send({ success: true, message: "authentication succeeded" });
    })(req, res, next);
  });

  router.get("/auth/google", passport.authenticate("google"));
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/signdupa",
      failureFlash: true,
    })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/signin",
    })
  );

  router.get("*", async (ctx) => {
    await handle(ctx.req, ctx.res);
  });
  server.use(router.routes());

  httpServer.listen(process.env.PORT || 3000);
})();
