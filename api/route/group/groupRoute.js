const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const {
  getGroupsQuery,
  getSortedGroupsQuery,
  getSortedSubscribedGroupsQuery,
  addUserQuery,
  deleteUserQuery,
  inviteUserQuery,
  getIdUserQuery,
  acceptInvitationToGroup,
  declineInvitationToGroup,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, idUser, keyWords, onlySubscribed } = req.body;
  const { id: idOwner } = decodeToken(req);

  let getGroups;

  if (!keyWords) {
    try {
      getGroups = await client.query(getGroupsQuery, [idUser, idOwner, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getGroups = await client.query(getSortedSubscribedGroupsQuery, [
          idUser,
          `%${keyWords}%`,
          idOwner,
          from,
        ]);
      else
        getGroups = await client.query(getSortedGroupsQuery, [
          `%${keyWords}%`,
          idOwner,
          from,
        ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  }

  let { rows: groups } = getGroups;
  let isMore = true;

  if (groups.length < 21) {
    isMore = false;
  } else {
    groups = groups.slice(0, -1);
  }

  res.status(200).json({ isMore, groups });
});

router.post("/user/add", async (req, res) => {
  const { idGroup } = req.body;

  const { id: idOwner } = decodeToken(req);

  const role = "user";
  const date = new Date();

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      idGroup,
      idOwner,
      role,
      date,
    ]);

    let id;
    if (!addUser[0]) {
      const { rows } = await client.query(getIdUserQuery, [idGroup, idOwner]);
      id = rows[0].id;
    } else {
      id = addUser[0].id;
    }

    res.status(200).json({ id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/delete", async (req, res) => {
  const { idSub } = req.body;

  try {
    await client.query(deleteUserQuery, [idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invite", async (req, res) => {
  const { idUser, idTarget } = req.body;

  try {
    const a = await client.query(inviteUserQuery, [idTarget, idUser]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/accept", async (req, res) => {
  const { idSubscribe } = req.body;
  try {
    await client.query(acceptInvitationToGroup, [idSubscribe]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/decline", async (req, res) => {
  const { idSubscribe } = req.body;

  try {
    await client.query(declineInvitationToGroup, [idSubscribe]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
