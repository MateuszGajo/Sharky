const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { userId, from } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId, firstName, lastName, photo } = await decodeToken(
    req.cookies.token
  );
  if (error) return res.status(401).json(error);

  const getMessagesQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/messages.sql"))
    .toString();

  try {
    const { rowCount, rows } = await client.query(getMessagesQuery, [
      userId,
      ownerId,
      from,
    ]);
    let isMore = true;
    if (rowCount < 20) {
      isMore = false;
    }

    return res.status(200).json({
      messages: rows,
      isMore,
      user: { id: ownerId, firstName, lastName, photo },
    });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.get("/conversation/get", async (req, res) => {
  const { error, id: ownerId } = await decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getConversationsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/conversations.sql"))
    .toString();
  try {
    const { rows: conversations } = await client.query(getConversationsQuery, [
      ownerId,
    ]);
    return res.status(200).json({ conversations });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { message, userId } = req.body;
  if (!/^[\d]*$/.test(userId) || !message) {
    return res.status(400).json("invalid-data");
  }

  const { error, id: ownerId } = await decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const addMessageQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/message.sql"))
    .toString();
  const date = new Date();

  try {
    const { rows } = await client.query(addMessageQuery, [
      message,
      date,
      ownerId,
      userId,
    ]);

    return res.status(200).json({ messageId: rows[0].id, date });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
