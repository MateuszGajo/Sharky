const express = require("express");
const bcrypt = require("bcrypt");
const { client } = require("../../../config/pgAdaptor");
const {
  getUserQuery,
  getPhotosQuery,
  muteUserQuery,
  removeFriendQuery,
  blockUserQuery,
  getPasswordQuery,
} = require("./query");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/keys");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { idUsers } = req.body;

  try {
    const { rows: users } = await client.query(getUserQuery, [idUsers]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get/photo", async (req, res) => {
  const { idUser, from } = req.body;
  let result;
  try {
    result = await client.query(getPhotosQuery, [idUser, from]);
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

router.post("/mute", async (req, res) => {
  const { idMuteUser } = req.body;

  const { id: idOwner } = decodeToken(req);

  const date = new Date();

  try {
    await client.query(muteUserQuery, [idOwner, idMuteUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/block", async (req, res) => {
  const { idBlockUser } = req.body;
  const date = new Date();

  const { id: idOwner } = decodeToken(req);

  try {
    await client.query(removeFriendQuery, [idOwner, idBlockUser]);
    await client.query(muteUserQuery, [idOwner, idBlockUser, date]);
    await client.query(blockUserQuery, [idOwner, idBlockUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.get("/logout", async (req, res) => {
  const { id: idOwner } = decodeToken(req);
  res.clearCookie("token");
  res.status(200).json({ idUser: idOwner });
});

router.get("/me", (req, res) => {
  console.log("wchodizmy");
  if (!req.cookies.token) return res.status(401).json("un-authorized");
  jwt.verify(req.cookies.token, jwtSecret, function (err, decoded) {
    if (decoded) {
      console.log(decoded.data);
      return res.json({ user: decoded.data });
    }
    return res.status(401).json("un-authorized");
  });
});

router.post("/check/password", async (req, res) => {
  const { password } = req.body;

  const { id: idOwner } = decodeToken(req);

  const { rows } = await client.query(getPasswordQuery, [idOwner]);
  bcrypt.compare(password, rows[0].password, function (err, result) {
    if (result) {
      return res.status(200).json({ success: true });
    }
    res.status(401).json("bad-password");
  });
});

module.exports = router;
