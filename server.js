const Koa = require("koa");
const next = require("next");
const Router = require("koa-router");
const io = require("socket.io");
const http = require("http");
const passport = require("koa-passport");
const session = require("koa-session");
const bodyParser = require("koa-bodyparser");
const flash = require("koa-connect-flash");
const cors = require("@koa/cors");
const authRoute = require("./api/route/auth/authRoute");
require("./config/passportSetup");

const router = Router();

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = new Koa();

server.use(bodyParser());
server.keys = ["super-secret-key"];
server.use(session(server));
server.use(flash());
server.use(async function (ctx, next) {
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
});
server.use(passport.initialize());
server.use(passport.session());

const httpServer = http.createServer(server.callback());
const socketIO = io(httpServer);

(async () => {
  await app.prepare();
  server.use(authRoute.routes());
  server.use(authRoute.allowedMethods());

  router.get("*", async (ctx) => {
    await handle(ctx.req, ctx.res);
  });
  server.use(router.routes());
  server.use(router.allowedMethods());

  httpServer.listen(process.env.PORT || 3000);
})();
