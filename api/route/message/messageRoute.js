const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const { getMessagesQuery, addMessageQuery } = require("./query");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { idChat } = req.body;

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
  const { data: user } = jwt.verify(token, jwtSecret);

  try {
    const messages = await client.query(getMessagesQuery, [idChat]);

    res.status(200).json({ messages: messages.rows, user });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { idChat, message, idUser, date } = req.body;

  try {
    const { rows } = await client.query(addMessageQuery, [
      idChat,
      idUser,
      message,
      date,
    ]);
    res.status(200).json({ idMessage: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
