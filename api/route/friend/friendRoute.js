const express = require("express");
const fs = require("fs");
const path = require("path");
const { composeInitialProps } = require("react-i18next");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.get("/get", async (req, res) => {
  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getChatsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/chats.sql"))
    .toString();

  try {
    const friends = await client.query(getChatsQuery, [ownerId]);
    res.status(200).json({ friends: friends.rows });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { userId } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getFriendshipIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/friendshipId.sql"))
    .toString();
  const addUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/user.sql"))
    .toString();

  try {
    const { rows } = await client.query(getFriendshipIdQuery, [
      ownerId,
      userId,
    ]);
    if (rows[0]) {
      return res.status(200).json({ friendshipId: rows[0].id });
    }
    const { rows: addUser } = await client.query(addUserQuery, [
      ownerId,
      userId,
    ]);

    res.status(200).json({ friendshipId: addUser[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { userId } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/user.sql"))
    .toString();
  const deleteFriendRelationQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/friendRelation.sql"))
    .toString();
  const deleteChatQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/chat.sql"))
    .toString();

  try {
    const { rows } = await client.query(deleteUserQuery, [userId, ownerId]);
    const friendshipId = rows[0].id;
    await client.query(deleteFriendRelationQuery, [friendshipId]);
    await client.query(deleteChatQuery, [friendshipId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/accept", async (req, res) => {
  const { userId } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const relation = "friend";
  const acceptRequestQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/friendStatus.sql"))
    .toString();
  const addRelationQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/relation.sql"))
    .toString();
  const addChatQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/chat.sql"))
    .toString();

  try {
    const { rows } = await client.query(acceptRequestQuery, [userId, ownerId]);
    let chatId;
    if (rows[0]) {
      const friendshipId = rows[0].id;

      await client.query(addRelationQuery, [friendshipId, relation]);
      const { rows: chat } = await client.query(addChatQuery, [friendshipId]);

      chatId = chat[0].id;
    }

    res.status(200).json({ chatId, relation, success: rows[0] ? true : false });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/decline", async (req, res) => {
  const { userId } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteFriendRequestQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/friendRequest.sql"))
    .toString();

  try {
    await client.query(deleteFriendRequestQuery, [userId, ownerId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get/people", async (req, res) => {
  const { userId, from, onlyFriends } = req.body;
  let { keyWords } = req.body;
  if (
    !/^[\d]*$/.test(userId) ||
    !/^[\d]*$/.test(from) ||
    !(typeof keyWords === "string" || keyWords === null) ||
    !(onlyFriends == true || onlyFriends == false)
  )
    return res.status(400).json("invalid-data");

  if (keyWords) {
    keyWords = keyWords.split(/\s+/);
    if (keyWords.length > 2)
      return res.status(200).json({ friends: [], isMore: false });
  }

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getFriendsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/friends.sql"))
    .toString();
  const getFriendsSortedQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/friendsSorted.sql"))
    .toString();
  const getUserSortedQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/usersSorted.sql"))
    .toString();
  let result;

  if (!keyWords) {
    try {
      result = await client.query(getFriendsQuery, [
        userId,
        ownerId,
        from,
        onlyFriends,
      ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlyFriends)
        result = await client.query(getFriendsSortedQuery, [
          keyWords[0] + "%",
          (keyWords[1] ? keyWords[1] : "") + "%",
          ownerId,
          from,
        ]);
      else
        result = await client.query(getUserSortedQuery, [
          keyWords[0] + "%",
          (keyWords[1] ? keyWords[1] : "") + "%",
          ownerId,
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
  const { userId } = req.body;
  if (!/^[\d]*$/.test(userId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const readMessageQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/message.sql"))
    .toString();

  client.query(readMessageQuery, [userId, ownerId]);
});

router.post("/update/relation", async (req, res) => {
  const { userId, relation } = req.body;
  if (
    !/^[\d]*$/.test(userId) ||
    !(relation === "friend" || relation === "family" || relation === "pal")
  )
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const updateRelationQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/relation.sql"))
    .toString();

  try {
    await client.query(updateRelationQuery, [relation, userId, ownerId]);

    res.status(200);
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
