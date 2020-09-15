const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const {
  getFriendsQuery,
  getSortedFriendsQuery,
  getSortedUsersQuery,
  getChatsQuery,
  getIdFriendshipQuery,
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
  const { id: idOwner } = decodeToken(req);

  try {
    const friends = await client.query(getChatsQuery, [idOwner]);
    res.status(200).json({ friends: friends.rows });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { idUser } = req.body;
  const { id: idOwner } = decodeToken(req);

  try {
    const { rows } = await client.query(getIdFriendshipQuery, [
      idOwner,
      idUser,
    ]);
    if (rows[0]) {
      return res.status(200).json({ idFriendShip: rows[0].id });
    }
    const { rows: addUser } = await client.query(addUserQuery, [
      idOwner,
      idUser,
    ]);

    res.status(200).json({ idFriendShip: addUser[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { idFriendShip } = req.body;

  try {
    await client.query(deleteUserQuery, [idFriendShip]);
    await client.query(deleteFriendRelationQuery, [idFriendShip]);
    await client.query(deleteChatQuery, [idFriendShip]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/accept", async (req, res) => {
  const { idFriendShip } = req.body;

  const relation = "friend";
  try {
    const { rows } = await client.query(acceptRequest, [idFriendShip]);
    let idChat;

    if (rows[0]) {
      await client.query(setRelation, [idFriendShip, relation]);
      const { rows: chat } = await client.query(addChatQuery, [idFriendShip]);
      idChat = chat[0].id;
    }

    res.status(200).json({ idChat, relation, success: rows[0] ? true : false });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/decline", async (req, res) => {
  const { idFriendShip } = req.body;

  try {
    client.query(removeFriendsRequest, [idFriendShip]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get/people", async (req, res) => {
  const { idUser, from, onlyFriends } = req.body;
  let { keyWords } = req.body;
  if (keyWords) {
    keyWords = keyWords.split(/\s+/);
    if (keyWords.length > 2)
      return res.status(200).json({ friends: [], isMore: false });
  }

  const { id: idOwner } = decodeToken(req);

  let result;

  if (!keyWords) {
    try {
      result = await client.query(getFriendsQuery, [
        idUser,
        idOwner,
        from,
        idUser == idOwner ? true : false,
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
          idOwner,
          from,
        ]);
      else
        result = await client.query(getSortedUsersQuery, [
          keyWords[0] + "%",
          (keyWords[1] ? keyWords[1] : "") + "%",
          idOwner,
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

router.post("/chat/join", (req, res) => {
  const { users } = req.body;
  const { io } = req;
  const session = req.session;

  for (let i = 0; i < users.length; i++) {
    io.sockets.connected[session.socketio].join(users[i].idChat);
  }

  res.status(200);
});

router.post("/message/read", (req, res) => {
  const { idChat } = req.body;

  client.query(readMessageQuery, [idChat]);
});

router.post("/update/relation", async (req, res) => {
  const { idFriendShip, idUser, relation } = req.body;

  try {
    await client.query(updateRelationQuery, [relation, idUser, idFriendShip]);
    res.status(200);
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
