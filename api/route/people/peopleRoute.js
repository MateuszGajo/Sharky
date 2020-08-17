const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const { group_getPeopleQuery, group_getFriendsQuery } = require("./query");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { idTarget, from, type } = req.body;
  let { keyWords } = req.body;
  if (keyWords) {
    keyWords = keyWords.split(/\s+/);
    if (keyWords.length > 2)
      return res.status(200).json({ friends: [], isMore: false });
  }

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
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  let result;
  if (!keyWords) {
    try {
      if (type == "group")
        result = await client.query(group_getFriendsQuery, [
          idOwner,
          idTarget,
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
          idTarget,
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
