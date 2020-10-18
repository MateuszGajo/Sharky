const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, userId, keyWords, onlySubscribed } = req.body;

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getGroupsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groups.sql"))
    .toString();
  const getGroupsSortedSubscirbedQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupsSortedSubscribed.sql")
    )
    .toString();
  const getGroupsSortedQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupsSorted.sql"))
    .toString();
  let getGroups;

  if (!keyWords) {
    try {
      getGroups = await client.query(getGroupsQuery, [userId, ownerId, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getGroups = await client.query(getGroupsSortedSubscirbedQuery, [
          userId,
          `%${keyWords}%`,
          ownerId,
          from,
        ]);
      else
        getGroups = await client.query(getGroupsSortedQuery, [
          `%${keyWords}%`,
          ownerId,
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
  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const date = new Date();
  const createGroupQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/group.sql"))
    .toString();
  const addAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/admin.sql"))
    .toString();

  try {
    const { rows } = await client.query(createGroupQuery, [
      name,
      description,
      date,
    ]);
    await client.query(addAdminQuery, [rows[0].id, ownerId, date]);

    res.status(200).json({ id: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/add", async (req, res) => {
  const { groupId } = req.body;
  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const role = "member";
  const date = new Date();
  const addUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/user.sql"))
    .toString();
  const getUserIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/userId.sql"))
    .toString();

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      groupId,
      ownerId,
      role,
      date,
    ]);

    let id;
    if (!addUser[0]) {
      const { rows } = await client.query(getUserIdQuery, [groupId, ownerId]);
      id = rows[0].id;
    } else {
      id = addUser[0].id;
    }

    res.status(200).json({ id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invite", async (req, res) => {
  const { userId, targetId } = req.body;

  const inviteUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/inviteUser.sql"))
    .toString();

  try {
    await client.query(inviteUserQuery, [targetId, userId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
