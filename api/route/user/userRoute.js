const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { userIds } = req.body;

  const { error } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/user.sql"))
    .toString();

  try {
    const { rows: users } = await client.query(getUserQuery, [userIds]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get/photo", async (req, res) => {
  const { userId, from } = req.body;

  const { error } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getPhotosQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/photos.sql"))
    .toString();
  let result;

  try {
    result = await client.query(getPhotosQuery, [userId, from]);
  } catch {
    res.status(400).json("bad-request");
  }
  let { rows: photos } = result;
  let isMore = true;

  if (photos.length < 7) {
    isMore = false;
  } else {
    photos = photos.slice(0, -1);
  }

  res.status(200).json({ photos, isMore });
});

router.get("/get/language", async (req, res) => {
  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getLanguageQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/language.sql"))
    .toString();

  try {
    const { rows } = await client.query(getLanguageQuery, [ownerId]);
    res.status(200).json({ language: rows[0].language });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/mute", async (req, res) => {
  const { userId } = req.body;

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const muteUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/muteUser.sql"))
    .toString();
  const date = new Date();

  try {
    await client.query(muteUserQuery, [ownerId, userId, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/block", async (req, res) => {
  const { userId } = req.body;

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteFriendQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/friend.sql"))
    .toString();
  const muteUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/muteUser.sql"))
    .toString();
  const blockUserQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/blockUser.sql"))
    .toString();
  const date = new Date();

  try {
    await client.query(deleteFriendQuery, [ownerId, userId]);
    await client.query(muteUserQuery, [ownerId, userId, date]);
    await client.query(blockUserQuery, [ownerId, userId, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.get("/logout", async (req, res) => {
  const { id: ownerId } = decodeToken(req.cookies.token);
  res.clearCookie("token");
  res.status(200).json({ userId: ownerId });
});

router.get("/me", async (req, res) => {
  const getPasswordQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/password.sql"))
    .toString();
  const getThirdIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/thirdId.sql"))
    .toString();
  const user = decodeToken(req.cookies.token);
  if (user.error) return res.status(401).json(user.error);

  try {
    const { rowCount } = await client.query(getThirdIdQuery, [user.id]);
    if (rowCount === 0) {
      const { rows } = await client.query(getPasswordQuery, [user.id]);
      if (user.password !== rows[0].password)
        return res.status(401).json("password-changed");
    }
    return res.status(200).json({ user });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/check/password", async (req, res) => {
  const { password } = req.body;
  if (typeof password !== "string") return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getPasswordQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/password.sql"))
    .toString();

  try {
    const { rows } = await client.query(getPasswordQuery, [ownerId]);

    await bcrypt.compare(password, rows[0].password, function (err, result) {
      if (result) {
        return res.status(200).json({ success: true });
      }
      res.status(401).json("bad-password");
    });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
