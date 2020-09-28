const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const { getMessagesQuery, addMessageQuery } = require("./query");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { chatId } = req.body;
  const { id, firstName, lastName, photo } = decodeToken(req);

  try {
    const messages = await client.query(getMessagesQuery, [chatId]);

    res.status(200).json({
      messages: messages.rows,
      user: { id, firstName, lastName, photo },
    });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { chatId, message, userId, date } = req.body;

  try {
    const { rows } = await client.query(addMessageQuery, [
      chatId,
      userId,
      message,
      date,
    ]);
    res.status(200).json({ messageId: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
