import express from "express";
import next from "next";
import Router from "./route/routes";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = Router.getRequestHandler(app);
const server = express();

(async () => {
  await app.prepare();

  server.get("*", (req, res) => handle(req, res));
  server.listen(3000);
})();
