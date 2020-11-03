const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { userId } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId, firstName, lastName, photo } = decodeToken(
    req.cookies.token
  );
  if (error) return res.status(401).json(error);

  const getMessagesQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/messages.sql"))
    .toString();

  try {
    const messages = await client.query(getMessagesQuery, [userId, ownerId]);
    res.status(200).json({
      messages: messages.rows,
      user: { id: ownerId, firstName, lastName, photo },
    });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
