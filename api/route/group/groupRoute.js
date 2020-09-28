const express = require("express");

const { client } = require("../../../config/pgAdaptor");
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
  getuserIDQuery,
  createGroupQuery,
  addAdminQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, userId, keyWords, onlySubscribed } = req.body;
  const { id: onwerId } = decodeToken(req);

  let getGroups;

  if (!keyWords) {
    try {
      getGroups = await client.query(getGroupsQuery, [userId, onwerId, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getGroups = await client.query(getSortedSubscribedGroupsQuery, [
          userId,
          `%${keyWords}%`,
          onwerId,
          from,
        ]);
      else
        getGroups = await client.query(getSortedGroupsQuery, [
          `%${keyWords}%`,
          onwerId,
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

router.post("/create", async (req, res) => {
  const { name, description } = req.body;

  const { id: onwerId } = decodeToken(req);
  const date = new Date();

  try {
    const { rows } = await client.query(createGroupQuery, [
      name,
      description,
      date,
    ]);
    await client.query(addAdminQuery, [rows[0].id, onwerId, date]);

    res.status(200).json({ id: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/add", async (req, res) => {
  const { groupId } = req.body;

  const { id: onwerId } = decodeToken(req);

  const role = "member";
  const date = new Date();

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      groupId,
      onwerId,
      role,
      date,
    ]);

    let id;
    if (!addUser[0]) {
      const { rows } = await client.query(getuserIDQuery, [groupId, onwerId]);
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
  const { subId } = req.body;

  try {
    await client.query(deleteUserQuery, [subId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invite", async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    const a = await client.query(inviteUserQuery, [targetId, userId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/accept", async (req, res) => {
  const { subscribeId } = req.body;
  try {
    await client.query(acceptInvitationToGroup, [subscribeId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/decline", async (req, res) => {
  const { subscribeId } = req.body;

  try {
    await client.query(declineInvitationToGroup, [subscribeId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
