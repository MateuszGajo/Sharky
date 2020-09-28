const express = require("express");
const bcrypt = require("bcrypt");
const { client } = require("../../../config/pgAdaptor");
const {
  getUserQuery,
  getPhotosQuery,
  muteUserQuery,
  removeFriendQuery,
  blockUserQuery,
  verifyCountryQuery,
  changeCountryQuery,
  verifyLanguageQuery,
  changeLanguageQuery,
  changeEmailQuery,
  changePhoneQuery,
  changePasswordQuery,
  getPasswordQuery,
  getUserPersonalInfoQuery,
  getLanguageQuery,
} = require("./query");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/keys");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

const saltRounds = 10;

router.post("/get", async (req, res) => {
  const { userIds } = req.body;

  try {
    const { rows: users } = await client.query(getUserQuery, [userIds]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get/photo", async (req, res) => {
  const { userId, from } = req.body;
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

router.post("/change/country", async (req, res) => {
  let { value } = req.body;
  value = value.toLowerCase();

  const { id: ownerId } = decodeToken(req);

  try {
    const country = await client.query(verifyCountryQuery, [value]);
    if (!country.rows[0]) return res.status(406).json("country-does-not-exist");

    await client.query(changeCountryQuery, [value, ownerId]);

    res.status(200).json({ sucess: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/language", async (req, res) => {
  let { value } = req.body;
  value = value.toLowerCase();

  const { id: ownerId } = decodeToken(req);

  try {
    const language = await client.query(verifyLanguageQuery, [value]);
    if (!language.rows[0])
      return res.status(406).json("language-does-not-exist");

    await client.query(changeLanguageQuery, [value, ownerId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/email", async (req, res) => {
  const { value } = req.body;

  const { id: ownerId } = decodeToken(req);

  try {
    await client.query(changeEmailQuery, [value, ownerId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/phone", async (req, res) => {
  const { value } = req.body;
  const phone = value.replace(/[\s-]/gi, "");

  const { id: ownerId } = decodeToken(req);

  try {
    await client.query(changePhoneQuery, [phone, ownerId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get/language", async (req, res) => {
  const { userId } = req.body;

  try {
    const { rows } = await client.query(getLanguageQuery, [userId]);
    res.status(200).json({ language: rows[0].language });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/password", async (req, res) => {
  const { value } = req.body;

  const { id: ownerId } = decodeToken(req);

  bcrypt.hash(value, saltRounds, async (err, hash) => {
    if (hash) {
      try {
        await client.query(changePasswordQuery, [hash, ownerId]);

        res.status(200).json({ userId: ownerId });
      } catch {
        res.status(400).json("bad-request");
      }
    }
  });
});

router.post("/mute", async (req, res) => {
  const { idMuteUser } = req.body;

  const { id: onwerId } = decodeToken(req);

  const date = new Date();

  try {
    await client.query(muteUserQuery, [onwerId, idMuteUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/block", async (req, res) => {
  const { userId } = req.body;
  const date = new Date();

  const { id: onwerId } = decodeToken(req);

  try {
    await client.query(removeFriendQuery, [onwerId, userId]);
    await client.query(muteUserQuery, [onwerId, userId, date]);
    await client.query(blockUserQuery, [onwerId, userId, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.get("/logout", async (req, res) => {
  const { id: onwerId } = decodeToken(req);
  res.clearCookie("token");
  res.status(200).json({ userId: onwerId });
});

router.get("/me", (req, res) => {
  if (!req.cookies.token) return res.status(401).json("un-authorized");
  jwt.verify(req.cookies.token, jwtSecret, function (err, decoded) {
    if (decoded) {
      return res.json({ user: decoded.data });
    }
    return res.status(401).json("un-authorized");
  });
});

router.post("/check/password", async (req, res) => {
  const { password } = req.body;

  const { id: onwerId } = decodeToken(req);

  const { rows } = await client.query(getPasswordQuery, [onwerId]);
  bcrypt.compare(password, rows[0].password, function (err, result) {
    if (result) {
      return res.status(200).json({ success: true });
    }
    res.status(401).json("bad-password");
  });
});

router.get("/me/info", async (req, res) => {
  const { id } = decodeToken(req);

  try {
    const { rows } = await client.query(getUserPersonalInfoQuery, [id]);

    res.status(200).json({ ...rows[0] });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
