const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const { group_getPeopleQuery, group_getFriendsQuery } = require("./query");
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

  const { id: onwerId } = decodeToken(req);

  let result;
  if (!keyWords) {
    try {
      if (type == "group")
        result = await client.query(group_getFriendsQuery, [
          onwerId,
          targetId,
          from,
        ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (type == "group")
        result = await client.query(group_getPeopleQuery, [
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
