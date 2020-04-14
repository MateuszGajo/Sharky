const Router = require("nextjs-dynamic-routes");

const router = new Router();

router.add({ name: "profile", pattern: "/profile/:id" });
router.add({ name: "post", pattern: "/post/:id" });
router.add({ name: "friend", pattern: "/friend/:id" });
router.add({ name: "group", pattern: "/group/:id" });
router.add({ name: "fanpage", pattern: "/fanpage/:id" });
router.add({ name: "news", pattern: "/news/:id" });
router.add({ name: "message", pattern: "/message/:id" });

module.exports = router;
