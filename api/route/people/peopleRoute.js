const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { targetId, from, type } = req.body;
  let { keyWords } = req.body;
  if (keyWords) {
    keyWords = keyWords.split(/\s+/);
    if (keyWords.length > 2)
      return res.status(200).json({ friends: [], isMore: false });
  }

  const { id: onwerId } = decodeToken(req.cookies.token);

  const getFriendsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/friends.sql"))
    .toString();
  const getPeopleQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/people.sql"))
    .toString();
  let result;
  if (!keyWords) {
    try {
      if (type == "group")
        result = await client.query(getFriendsQuery, [onwerId, targetId, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (type == "group")
        result = await client.query(getPeopleQuery, [
          keyWords[0] + "%",
          (keyWords[1] ? keyWords[1] : "") + "%",
          targetId,
          from,
        ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  }

  let { rows: friends } = result;
  let isMore = true;

  if (friends.length < 21) {
    isMore = false;
  } else {
    friends = friends.slice(0, -1);
  }

  res.status(200).json({ friends, isMore });
});

module.exports = router;
