const express = require("express");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const {
  getFanpagesQuery,
  getSortedFanpagesQuery,
  getSortedSubscribedFanpagesQuery,
  addUserQuery,
  deleteUserQuery,
  getIdUserQuery,
  getFanpageAdminsQuery,
  fanpageInfoQuery,
  checkUserQuery,
  deleteFanpageQuery,
  deleteFanpageUsersQuery,
  deleteFanpagePostsQuery,
  getMembersQuery,
  updateMemberRealtionQuery,
  getuserIDQuery,
  createFanpageQuery,
  addAdminQuery,
  changeFanpagePhotoQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/about", async (req, res) => {
  const { fanpageId } = req.body;

  try {
    const { rows: fanpageInfo } = await client.query(fanpageInfoQuery, [
      fanpageId,
    ]);

    res.status(200).json({ fanpageInfo: fanpageInfo[0] });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/enter", async (req, res) => {
  const { fanpageId } = req.body;

  const { id: ownerId } = decodeToken(req);

  try {
    const { rows } = await client.query(checkUserQuery, [fanpageId, ownerId]);
    if (!rows[0]) return res.status(404).json("fanpage-does-not-exist");

    const subId = rows[0] ? rows[0].subId : null;
    const role = rows[0] ? rows[0].role : null;
    const id = rows[0].id;
    res.status(200).json({ subId, role, id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { fanpageId } = req.body;

  try {
    await client.query(deleteFanpageQuery, [fanpageId]);
    await client.query(deleteFanpageUsersQuery, [fanpageId]);
    await client.query(deleteFanpagePostsQuery, [fanpageId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { fanpageId, from } = req.body;

  let result;
  try {
    result = await client.query(getMembersQuery, [fanpageId, from]);
  } catch {
    res.status(400).json("bad-request");
  }

  let { rows: members } = result;
  let isMore = true;
  if (members.length < 21) {
    isMore = false;
  } else {
    members = members.slice(0, -1);
  }

  res.status(200).json({ members, isMore });
});

router.post("/member/relation/change", async (req, res) => {
  const { subId, relation } = req.body;

  try {
    await client.query(updateMemberRealtionQuery, [relation, subId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from, userId, keyWords, onlySubscribed } = req.body;

  const { id: onwerId } = decodeToken(req);
  let getFanpages;
  if (!keyWords) {
    try {
      getFanpages = await client.query(getFanpagesQuery, [
        userId,
        onwerId,
        from,
      ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getFanpages = await client.query(getSortedSubscribedFanpagesQuery, [
          userId,
          `%${keyWords}%`,
          onwerId,
          from,
        ]);
      else
        getFanpages = await client.query(getSortedFanpagesQuery, [
          `%${keyWords}%`,
          onwerId,

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

  const { id: onwerId } = decodeToken(req);
  const date = new Date();

  try {
    const { rows } = await client.query(createFanpageQuery, [
      name,
      description,
      date,
    ]);

    await client.query(addAdminQuery, [rows[0].id, onwerId]);

    res.status(200).json({ id: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/add", async (req, res) => {
  const { fanpageId } = req.body;

  const { id: onwerId } = decodeToken(req);

  const role = "user";

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      fanpageId,
      onwerId,
      role,
    ]);

    let id;

    if (!addUser[0]) {
      const { rows } = await client.query(getuserIDQuery, [fanpageId, onwerId]);
      id = rows[0].id;
    } else id = addUser[0].id;

    res.status(200).json({ id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/delete", async (req, res) => {
  const { subId, fanpageId, role } = req.body;

  let admins;
  if (role == "admin") {
    admins = await client.query(getFanpageAdminsQuery, [fanpageId]);
  }

  if (role != "admin" || admins.rowCount > 1) {
    try {
      await client.query(deleteUserQuery, [subId]);

      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  } else res.status(403).json("last-fanpage-admin");
});

router.post("/change/photo", async (req, res) => {
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

    let fileName = null;
    if (req.file) {
      const {
        file: { mimetype, filename, size },
      } = req;
      fileName = filename;
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(415).json("wrong-file-type");
      }
      if (size > 200000) {
        return res.status(413).json("file-too-large");
      }
    }
    const { fanpageId } = req.body;

    try {
      await client.query(changeFanpagePhotoQuery, [fileName, fanpageId]);
      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  });
});

module.exports = router;
