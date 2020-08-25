const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { client } = require("../../../config/pgAdaptor");
const { post } = require("../post/postRoute");
const { jwtSecret } = require("../../../config/keys");
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
} = require("./query");

const saltRounds = 10;

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

router.post("/change/country", async (req, res) => {
  let { value } = req.body;
  value = value.toLowerCase();

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  try {
    const country = await client.query(verifyCountryQuery, [value]);
    if (!country.rows[0]) return res.status(406).json("country-does-not-exist");

    await client.query(changeCountryQuery, [value, idOwner]);

    res.status(200).json({ sucess: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/language", async (req, res) => {
  let { value } = req.body;
  value = value.toLowerCase();
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  try {
    const language = await client.query(verifyLanguageQuery, [value]);
    if (!language.rows[0])
      return res.status(406).json("language-does-not-exist");

    await client.query(changeLanguageQuery, [value, idOwner]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/email", async (req, res) => {
  const { value } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  try {
    await client.query(changeEmailQuery, [value, idOwner]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/phone", async (req, res) => {
  const { value } = req.body;
  const phone = value.replace(/[\s-]/gi, "");

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  try {
    await client.query(changePhoneQuery, [phone, idOwner]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/password", async (req, res) => {
  const { value } = req.body;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  bcrypt.hash(value, saltRounds, async (err, hash) => {
    if (hash) {
      try {
        await client.query(changePasswordQuery, [hash, idOwner]);

        res.status(200).json({ idUser: idOwner });
      } catch {
        res.status(400).json("bad-request");
      }
    }
  });
});

router.post("/mute", async (req, res) => {
  const { idMuteUser } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  const date = new Date();

  try {
    await client.query(muteUserQuery, [idUser, idMuteUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/block", async (req, res) => {
  const { idBlockUser } = req.body;
  const date = new Date();

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );

  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  try {
    await client.query(removeFriendQuery, [idUser, idBlockUser]);
    await client.query(muteUserQuery, [idUser, idBlockUser, date]);
    await client.query(blockUserQuery, [idUser, idBlockUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ sucess: true });
});

router.get("/me", (req, res) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
        firstName: "Jan",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    jwtSecret
  );

  const { data } = jwt.verify(token, jwtSecret);

  res.json({ user: data });
});

router.post("/check/password", async (req, res) => {
  const { password } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 22,
        firstName: "Jan",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    jwtSecret
  );

  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  const { rows } = await client.query(getPasswordQuery, [idOwner]);
  bcrypt.compare(password, rows[0].password, function (err, result) {
    if (result) {
      return res.status(200).json({ success: true });
    }
    res.status(401).json("bad-password");
  });
});

module.exports = router;
