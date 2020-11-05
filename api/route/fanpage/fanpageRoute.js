const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, userId, keyWords, onlySubscribed } = req.body;

  if (
    !/^[\d]*$/.test(from) ||
    (!userId && !/^[\d]*$/.test(userId)) ||
    !(onlySubscribed == true || onlySubscribed == false) ||
    !(typeof keyWords === "string" || keyWords === null)
  )
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getFanpagesQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/fanpages.sql"))
    .toString();
  const getFanpagesSortedSubscribed = fs
    .readFileSync(
      path.join(__dirname, "./query/get/fanpagesSortedSubscribed.sql")
    )
    .toString();
  const getFanpagesSorted = fs
    .readFileSync(path.join(__dirname, "./query/get/fanpagesSorted.sql"))
    .toString();
  let getFanpages;

  if (!keyWords) {
    try {
      getFanpages = await client.query(getFanpagesQuery, [
        userId,
        ownerId,
        from,
      ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getFanpages = await client.query(getFanpagesSortedSubscribed, [
          userId,
          `%${keyWords}%`,
          ownerId,
          from,
        ]);
      else
        getFanpages = await client.query(getFanpagesSorted, [
          `%${keyWords}%`,
          ownerId,
          from,
        ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  }

  let { rows: fanpages } = getFanpages;
  let isMore = true;

  if (fanpages.length < 21) {
    isMore = false;
  } else {
    fanpages = fanpages.slice(0, -1);
  }

  res.status(200).json({ isMore, fanpages });
});

router.post("/create", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const date = new Date();
  const createFanpageQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/fanpage.sql"))
    .toString();
  const addAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/admin.sql"))
    .toString();

  try {
    const { rows } = await client.query(createFanpageQuery, [
      name,
      description,
      date,
    ]);

    await client.query(addAdminQuery, [rows[0].id, ownerId]);

    res.status(200).json({ id: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/subscribe", async (req, res) => {
  const { fanpageId } = req.body;
  if (!/^[\d]*$/.test(fanpageId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const role = "user";
  const addUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/user.sql"))
    .toString();
  const getUserIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/userId.sql"))
    .toString();

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      fanpageId,
      ownerId,
      role,
    ]);

    let id;

    if (!addUser[0]) {
      const { rows } = await client.query(getUserIdQuery, [fanpageId, ownerId]);
      id = rows[0].id;
    } else id = addUser[0].id;

    res.status(200).json({ id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unsubscribe", async (req, res) => {
  const { fanpageId } = req.body;
  if (!/^[\d]*$/.test(fanpageId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteSubscriberQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/user.sql"))
    .toString();
  const getFanpageAdminsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/fanpageAdmins.sql"))
    .toString();

  const { rowCount, rows } = await client.query(getFanpageAdminsQuery, [
    fanpageId,
  ]);

  try {
    if (rowCount > 1 || rows[0].userId != ownerId) {
      await client.query(deleteSubscriberQuery, [fanpageId, ownerId]);

      res.status(200).json({ success: true });
    } else if (rowCount == 1) res.status(403).json("last-group-admin");
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
