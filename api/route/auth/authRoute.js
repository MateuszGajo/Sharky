const passport = require("passport");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const router = express.Router();

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
    res.redirect("/home");
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
    res.redirect("/home");
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
    res.redirect("/home");
  }
);

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (
    !/^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/.test(email)
  )
    return res.status(400).json("invalid-email");
  else if (!password) return res.status(400).json("empty-password");

  const findUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/user.sql"))
    .toString();
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
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
  } = creds;
  if (
    !/^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/.test(email)
  )
    return res.status(400).json("invalid-email");
  if (password.length < 6) return res.status(400).json("password-too-short");
  else if (!confirmPassword)
    return res.status(400).json("empty-confirm-password");
  else if (password !== confirmPassword)
    return res.status(400).json("passwords-not-equal");
  else if (!firstName) return res.status(400).json("empty-first-name");
  else if (!lastName) return res.status(400).json("empty-last-name");
  else if (!/[\d]{9}/.test(phone))
    return res.status(400).json("invalid-phone-number");

  const getUserIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/userId.sql"))
    .toString();
  const createUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/user.sql"))
    .toString();
  try {
    const { rowCount } = await client.query(getUserIdQuery, [email]);
    if (rowCount) return res.status(403).json("user-exist");

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

module.exports = router;
