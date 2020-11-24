const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/about", async (req, res) => {
  const { fanpageId } = req.body;
  if (!/^[\d]*$/.test(fanpageId)) return res.status(400).json("invalid-data");

  const { error } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getFanpageInfoQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/fanpageInfo.sql"))
    .toString();

  try {
    const { rows: fanpageInfo } = await client.query(getFanpageInfoQuery, [
      fanpageId,
    ]);

    res.status(200).json({ fanpageInfo: fanpageInfo[0] });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/enter", async (req, res) => {
  const { fanpageId } = req.body;
  if (!/^[\d]*$/.test(fanpageId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getPermissionQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/permissions.sql"))
    .toString();

  try {
    const { rows } = await client.query(getPermissionQuery, [
      fanpageId,
      ownerId,
    ]);
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
  if (!/^[\d]*$/.test(fanpageId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteFanpageQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/fanpage.sql"))
    .toString();
  const deleteFanpagePostsQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/fanpagePosts.sql"))
    .toString();
  const deleteFanpageUsersQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/fanpageUsers.sql"))
    .toString();
  const getAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
    .toString();

  try {
    const { rows } = await client.query(getAdminQuery, [ownerId, fanpageId]);
    if (!rows[0].id) return res.status(403).json("no-permission");
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
  if (!/^[\d]*$/.test(fanpageId) || !/^[\d]*$/.test(from))
    return res.status(400).json("invalid-data");

  const { error } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getMembersQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/members.sql"))
    .toString();
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
  const { subId, relation, fanpageId } = req.body;

  if (
    !/^[\d]*$/.test(subId) ||
    !(relation === "user" || relation === "admin" || relation === "moderator")
  )
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const updateMemberRealtionQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/memberRelation.sql"))
    .toString();
  const getAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/memberRelation.sql"))
    .toString();

  try {
    const { rows } = await client.query(getAdminQuery, [ownerId, fanpageId]);
    if (!rows[0].id) return res.status(403).json("no-permission");
    await client.query(updateMemberRealtionQuery, [relation, subId, fanpageId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

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
  try {
    const { rowCount, rows } = await client.query(getFanpageAdminsQuery, [
      fanpageId,
    ]);
    if (rowCount > 1 || rows[0].userId != ownerId) {
      await client.query(deleteSubscriberQuery, [fanpageId, ownerId]);
      return res.status(200).json({ success: true });
    } else if (rowCount == 1) res.status(403).json("last-group-admin");
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/delete", async (req, res) => {
  const { subId, fanpageId } = req.body;
  if (!/^[\d]*$/.test(subId) || !/^[\d]*$/.test(fanpageId))
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteSubscriberQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/userByAdmin.sql"))
    .toString();
  const getAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
    .toString();

  try {
    let { rows: admin } = await client.query(getAdminQuery, [
      ownerId,
      fanpageId,
    ]);
    if (!admin[0].id) return res.status(403).json("no-permission");
    const { rows } = await client.query(deleteSubscriberQuery, [
      subId,
      fanpageId,
    ]);
    if (!rows[0].id) return res.status(404).json("invalid-data");

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/change/photo", async (req, res) => {
  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/static/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        return cb(new Error("wrong file type"));
      }
      cb(null, true);
    },
    limits: { fileSize: 200000 },
  }).single("file");

  await upload(req, res, async (err) => {
    if (err) {
      return err.message == "File too large"
        ? res.status(413).json("file-too-large")
        : err.message === "wrong file type"
        ? res.status(415).json("wrong-file-type")
        : res.status(400).json("bad-request");
    }

    let fileName = null;
    if (req.file) {
      fileName = req.file.filename;
    }
    const { fanpageId } = req.body;

    if (!/^[\d]*$/.test(fanpageId)) {
      fs.unlinkSync(
        path.join(__dirname, `../../../public/static/images/${fileName}`)
      );
      return res.status(400).json("invalid-data");
    }
    const changeFanpagePhotoQuery = fs
      .readFileSync(path.join(__dirname, "./query/update/photo.sql"))
      .toString();
    const getAdminQuery = fs
      .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
      .toString();

    try {
      const { rows } = await client.query(getAdminQuery, [ownerId, fanpageId]);
      if (!rows[0].id) {
        fs.unlinkSync(
          path.join(__dirname, `../../../public/static/images/${fileName}`)
        );
        return res.status(403).json("no-permission");
      }
      await client.query(changeFanpagePhotoQuery, [fileName, fanpageId]);
      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  });
});

module.exports = router;
