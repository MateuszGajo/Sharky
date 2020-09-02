const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { client } = require("../../../config/pgAdaptor");
const {
  getUserQuery,
  getUserInfoQuery,
  getPhotosQuery,
  muteUserQuery,
  removeFriendQuery,
  blockUserQuery,
  addPhotoQuery,
  changePhotoQuery,
  getPasswordQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/add/photo", async (req, res) => {
  const { id: idOwner } = decodeToken(req);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/static/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({ storage }).single("file");

  await upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json("bad-request");
    }

    const {
      file: { mimetype, filename, size },
    } = req;

    const fileName = filename;

    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(415).json("wrong-file-type");
    }

    if (size > 200000) {
      return res.status(413).json("file-too-large");
    }

    try {
      await client.query(addPhotoQuery, [
        idOwner,
        fileName,
        new Date().toUTCString(),
      ]);

      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  });
});

router.post("/change/photo", async (req, res) => {
  const { id: idOwner } = decodeToken(req);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/static/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({ storage }).single("file");

  await upload(req, res, async (err) => {
    if (err) return res.status(400).json("bad-request");

    const {
      file: { mimetype, filename, size },
    } = req;

    const fileName = filename;

    try {
      await client.query(changePhotoQuery, [fileName, idOwner]);
      await client.query(addPhotoQuery, [
        idOwner,
        fileName,
        new Date().toUTCString(),
      ]);
      res.status(200).json({ fileName });
    } catch {
      res.status(400).json("bad-request");
    }
  });
});

router.post("/get", async (req, res) => {
  const { idUsers } = req.body;

  try {
    const { rows: users } = await client.query(getUserQuery, [idUsers]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/info", async (req, res) => {
  const { idUser } = req.body;

  try {
    const { rows } = await client.query(getUserInfoQuery, [idUser]);
    if (!rows[0]) return res.status(404).json("user-does-not-exist");

    res.status(200).json({ info: rows[0] });
  } catch {
    res.status(400).json("bad-request");
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

router.get("/me", (req, res) => {
  if (!req.cookies.token) return res.status(401).json("un-authorized");
  const { id, firstName, lastName, photo } = decodeToken(req);

  res.json({ user: { id, firstName, lastName, photo } });
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