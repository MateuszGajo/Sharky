const passport = require("koa-passport");
const router = require("koa-router")({ prefix: "/auth" });
const bodyParser = require("koa-body")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const saltRounds = 10;

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  }),
  (ctx, next) => {
    ctx.session.flash = [];
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

router.get("/facebook", passport.authenticate("facebook"), (ctx, next) => {
  ctx.session.flash = [];
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

router.post("/signin", async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const findUserQuery = "select * from users where email=$1";
  try {
    const findUser = await client.query(findUserQuery, [email]);
    if (findUser.rowCount == 0)
      return (ctx.body = { userNotExist: "user-not-exist" });

    const user = findUser.rows[0];
    const pwCorrect = await bcrypt.compare(password, user.password);
    if (pwCorrect) {
      const { first_name, last_name, email, phone, country, language } = user;
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: {
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            country,
            language,
          },
        },
        jwtSecret
      );
      return (ctx.body = { token });
    }
    return (ctx.body = { error: "password-hash-error" });
  } catch {
    return (ctx.body = { error: "connect-db-error" });
  }
});

router.post("/signup", async (ctx, next) => {
  const { email, password, firstName, lastName, phone } = ctx.request.body;
  const findUserQuery = "select * from users where email=$1";
  try {
    const findUser = await client.query(findUserQuery, [email]);
    if (findUser.rowCount > 0) return (ctx.body = { userExist: "user-exist" });

    try {
      const pwHash = await bcrypt.hash(password, saltRounds);
      const createUserQuery =
        "INSERT INTO users(email, password, first_name, last_name, phone) values($1,$2,$3,$4,$5)";

      try {
        const createUser = await client.query(createUserQuery, [
          email,
          pwHash,
          firstName,
          lastName,
          phone,
        ]);
        if (createUser.rowCount == 0)
          return (ctx.body = { error: "create-user-error" });

        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: {
              firstName,
              lastName,
              email,
              phone,
              country: null,
              language: null,
            },
          },
          jwtSecret
        );
        return (ctx.body = { token });
      } catch {
        return (ctx.body = { error: "connect-db-error" });
      }
    } catch {
      return (ctx.body = { error: "password-hash-error" });
    }
  } catch {
    return (ctx.body = { error: "connect-db-error" });
  }
});

router.get("/error", (ctx, next) => {
  ctx.body = ctx.flash("error")[0];
});

module.exports = router;
