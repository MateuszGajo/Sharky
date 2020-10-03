const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { chatId } = req.body;
  const { id, firstName, lastName, photo } = decodeToken(req);

  const getMessagesQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/messages.sql"))
    .toString();

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

  const addMessageQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/message.sql"))
    .toString();

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
