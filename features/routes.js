const Router = require("nextjs-dynamic-routes");

const router = new Router();
router.add({ name: "profile", pattern: "/profile/:id" });
router.add({ name: "post", pattern: "/post/:postId" });

module.exports = router;
