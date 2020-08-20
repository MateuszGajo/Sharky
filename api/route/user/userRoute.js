const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const { post } = require("../post/postRoute");
const { jwtSecret } = require("../../../config/keys");
const {
  getUserQuery,
  getUserInfoQuery,
  muteUserQuery,
  removeFriendQuery,
  blockUserQuery,
  addPhotoQuery,
  changePhotoQuery,
} = require("./query");

router.post("/add/photo", async (req, res) => {
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

    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(415).json("wrong-file-type");
    }

    if (size > 200000) {
      return res.status(413).json("file-too-large");
    }
    console.log(fileName, idOwner);

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
    console.log(rows);

    res.status(200).json({ info: rows[0] });
  } catch {
    res.status(400).json("bad-request");
  }
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

module.exports = router;
