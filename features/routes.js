const Router = require("nextjs-dynamic-routes");

const router = new Router();
router.add({ name: "post", pattern: "/post/:postId" });

module.exports = router;
