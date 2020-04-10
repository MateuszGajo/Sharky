const Router = require("nextjs-dynamic-routes");

const router = new Router();
router.add({ name: "profile", pattern: "/profile/:id" });

module.exports = router;
