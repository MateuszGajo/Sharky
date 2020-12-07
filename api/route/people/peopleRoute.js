const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { targetId, from, type } = req.body;
  if (
    !/^[\d]*$/.test(targetId) ||
    !/^[\d]*$/.test(from) ||
    typeof type !== "string"
  ) {
    return res.status(400).json("invalid-data");
  }

  const { error, id: ownerId } = await decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  let { keyWords } = req.body;
  if (keyWords) {
    keyWords = keyWords.split(/\s+/);
    if (keyWords.length > 2) {
      return res.status(200).json({ friends: [], isMore: false });
    }
  }

  const getFriendsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/friends.sql"))
    .toString();
  const getPeopleQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/people.sql"))
    .toString();
  let result;
  if (!keyWords) {
    try {
      if (type === "group") {
        result = await client.query(getFriendsQuery, [ownerId, targetId, from]);
      }
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (type === "group") {
        result = await client.query(getPeopleQuery, [
          `${keyWords[0]}%`,
          `${keyWords[1] ? keyWords[1] : ""}%`,
          targetId,
          from,
        ]);
      }
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

  return res.status(200).json({ friends, isMore });
});

module.exports = router;
