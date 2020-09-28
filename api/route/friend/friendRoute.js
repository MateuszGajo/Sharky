const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const {
  getFriendsQuery,
  getSortedFriendsQuery,
  getSortedUsersQuery,
  getChatsQuery,
  getfriendshipIDQuery,
  addUserQuery,
  deleteUserQuery,
  deleteFriendRelationQuery,
  deleteChatQuery,
  acceptRequest,
  setRelation,
  removeFriendsRequest,
  readMessageQuery,
  updateRelationQuery,
  addChatQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.get("/get", async (req, res) => {
  const { id: onwerId } = decodeToken(req);

  try {
    const friends = await client.query(getChatsQuery, [onwerId]);
    res.status(200).json({ friends: friends.rows });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { userId } = req.body;
  const { id: onwerId } = decodeToken(req);

  try {
    const { rows } = await client.query(getfriendshipIDQuery, [
      onwerId,
      userId,
    ]);
    if (rows[0]) {
      return res.status(200).json({ friendshipId: rows[0].id });
    }
    const { rows: addUser } = await client.query(addUserQuery, [
      onwerId,
      userId,
    ]);

    res.status(200).json({ friendshipId: addUser[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { friendshipId } = req.body;

  try {
    await client.query(deleteUserQuery, [friendshipId]);
    await client.query(deleteFriendRelationQuery, [friendshipId]);
    await client.query(deleteChatQuery, [friendshipId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/accept", async (req, res) => {
  const { friendshipId } = req.body;

  const relation = "friend";
  try {
    const { rows } = await client.query(acceptRequest, [friendshipId]);
    let chatId;

    if (rows[0]) {
      await client.query(setRelation, [friendshipId, relation]);
      const { rows: chat } = await client.query(addChatQuery, [friendshipId]);
      chatId = chat[0].id;
    }

    res.status(200).json({ chatId, relation, success: rows[0] ? true : false });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/decline", async (req, res) => {
  const { friendshipId } = req.body;

  try {
    client.query(removeFriendsRequest, [friendshipId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get/people", async (req, res) => {
  const { userId, from, onlyFriends } = req.body;
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
      result = await client.query(getFriendsQuery, [
        userId,
        onwerId,
        from,
        onlyFriends,
      ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlyFriends)
        result = await client.query(getSortedFriendsQuery, [
          keyWords[0] + "%",
          (keyWords[1] ? keyWords[1] : "") + "%",
          onwerId,
          from,
        ]);
      else
        result = await client.query(getSortedUsersQuery, [
          keyWords[0] + "%",
          (keyWords[1] ? keyWords[1] : "") + "%",
          onwerId,
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

router.post("/message/read", (req, res) => {
  const { chatId } = req.body;

  client.query(readMessageQuery, [chatId]);
});

router.post("/update/relation", async (req, res) => {
  const { friendshipId, userId, relation } = req.body;

  try {
    await client.query(updateRelationQuery, [relation, userId, friendshipId]);
    res.status(200);
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
