const passport = require("passport");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const router = express.Router();
const { findUserQuery, createUserQuery, getIdUserQuery } = require("./query");

const saltRounds = 10;

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        data: req.user,
      },
      jwtSecret
    );
    res.cookie("token", token);
    res.redirect("/");
  }
);

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        data: req.user,
      },
      jwtSecret
    );
    res.cookie("token", token);
    res.redirect("/");
  }
);

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
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
  try {
    const findUser = await client.query(findUserQuery, [email]);
    if (!findUser.rowCount) return res.status(401).json("invalid-creds");

    const user = findUser.rows[0];
    const pwCorrect = await bcrypt.compare(password, user.password);
    if (pwCorrect) {
      const {
        id,
        firstName,
        lastName,
        email,
        phone,
        country,
        language,
        city,
        birthDate,
      } = user;
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          data: {
            id,
            firstName,
            lastName,
            photo: "profile.png",
            email,
            phone,
            country,
            language,
            city,
            birthDate,
          },
        },
        jwtSecret
      );
      res.cookie("token", token);
      return res.status(200).json({ success: true });
    }
    return res.status(401).json("invalid-creds");
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/signup", async (req, res) => {
  const { creds } = req.body;
  const { email, password, firstName, lastName, phone } = creds;
  try {
    const idUser = await client.query(getIdUserQuery, [email]);
    if (idUser.rowCount) return res.status(403).json("user-exist");

    try {
      const pwHash = await bcrypt.hash(password, saltRounds);

      try {
        const { rows: user } = await client.query(createUserQuery, [
          email,
          pwHash,
          firstName,
          lastName,
          phone,
        ]);

        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            data: {
              id: user[0].id,
              firstName,
              lastName,
              photo: "profile.png",
              email,
              phone,
              country: null,
              language: null,
              city: null,
              birthDate: null,
            },
          },
          jwtSecret
        );
        res.cookie("token", token);
        res.status(200).json({ success: true });
      } catch {
        return res.status(400).json("bad-request");
      }
    } catch {
      return res.status(400).json("bad-request");
    }
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token || null;
  try {
    await jwt.verify(token, jwtSecret);
    return res.json({ verify: true });
  } catch {
    return res.json({ verify: false });
  }
});

module.exports = router;
