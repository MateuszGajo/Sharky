import Koa from "koa";
import next from "next";
import Router from "koa-router";
import io from "socket.io";
import http from "http";

const router = Router();

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const server = new Koa();

const httpServer = http.createServer(server.callback());
const socketIO = io(httpServer);

(async () => {
  await app.prepare();

  router.get("*", async (ctx) => {
    await handle(ctx.req, ctx.res);
  });

  server.use(router.routes());
  httpServer.listen(process.env.PORT || 3000);
})();
