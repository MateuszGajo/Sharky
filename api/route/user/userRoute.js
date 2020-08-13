const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { post } = require("../post/postRoute");
const { jwtSecret } = require("../../../config/keys");
const {
  getUserQuery,
  muteUserQuery,
  removeFriendQuery,
  blockUserQuery,
} = require("./query");

router.post("/get", async (req, res) => {
  const { idUsers } = req.body;

  try {
    const { rows: users } = await client.query(getUserQuery, [idUsers]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/mute", async (req, res) => {
  const { idMuteUser } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  const date = new Date();

  try {
    await client.query(muteUserQuery, [idUser, idMuteUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/block", async (req, res) => {
  const { idBlockUser } = req.body;
  const date = new Date();

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  try {
    await client.query(removeFriendQuery, [idUser, idBlockUser]);
    await client.query(blockUserQuery, [idUser, idBlockUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.get("/me", (req, res) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
        firstName: "Jan",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    jwtSecret
  );

  const { data } = jwt.verify(token, jwtSecret);

  res.json({ user: data });
});

module.exports = router;
