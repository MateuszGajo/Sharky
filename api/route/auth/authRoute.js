const passport = require("passport");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const router = express.Router();

const saltRounds = 10;

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  }),
  (req, res) => {
    // req.session.flash = [];
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    failureFlash: true,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: req.user,
      },
      jwtSecret
    );
    res.cookie("token", token);
    res.redirect("/");
  }
);

router.get("/facebook", passport.authenticate("facebook"), (req, res) => {
  // req.session.flash = [];
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/signin",
    failureFlash: true,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: req.user,
      },
      jwtSecret
    );
    res.cookie("token", token);
    res.redirect("/");
  }
);

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const findUserQuery = "select * from users where email=$1";
  try {
    const findUser = await client.query(findUserQuery, [email]);
    if (findUser.rowCount == 0)
      return res.json({ userNotExist: "user-not-exist" });

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
      res.cookie("token", token);
      return res.json({ error: "" });
    }
    return res.json({ error: "password-hash-error" });
  } catch {
    return res.json({ error: "connect-db-error" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const findUserQuery = "select * from users where email=$1";
  try {
    const findUser = await client.query(findUserQuery, [email]);
    if (findUser.rowCount > 0) return res.json({ userExist: "user-exist" });

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
          return res.json({ error: "create-user-error" });

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
        res.cookie("token", token);
        res.redirect("/");
      } catch {
        return res.json({ error: "connect-db-error" });
      }
    } catch {
      return res.json({ error: "password-hash-error" });
    }
  } catch {
    return res.json({ error: "connect-db-error" });
  }
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  try {
    await jwt.verify(token, jwtSecret);
    return res.json({ verify: true });
  } catch {
    return res.json({ verify: false });
  }
});

router.get("/error", (req, res) => {
  console.log(req.session);
  console.log(res.locals.sessionFlash);
  res.send("response");
});

module.exports = router;
