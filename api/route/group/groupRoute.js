const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const { group } = require("console");
const router = express.Router();

router.post("/enter", async (req, res) => {
  const { groupId } = req.body;
  if (!/^[0-9]*$/.test(groupId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getPrimaryInfoQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/primaryInfo.sql"))
    .toString();

  try {
    const { rows: info } = await client.query(getPrimaryInfoQuery, [
      groupId,
      ownerId,
    ]);

    if (!info[0]) {
      return res
        .status(200)
        .json({ memberId: null, name: null, role: null, id: null });
    }
    const id = info[0].id;
    const name = info[0].name;
    const photo = info[0].photo;
    const memberId = info[0] ? info[0].memberId : null;
    const role = info[0] ? info[0].role : null;

    res.status(200).json({ id, memberId, name, role, photo });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/about", async (req, res) => {
  const { groupId } = req.body;

  if (!/^[0-9]*$/.test(groupId)) return res.status(400).json("invalid-data");

  const { error } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getInfoQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupInfo.sql"))
    .toString();

  try {
    const { rows: info } = await client.query(getInfoQuery, [groupId]);
    res
      .status(200)
      .json({ numberOfMembers: info[0].numberOfMembers, date: info[0].date });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { groupId } = req.body;
  if (!/^[0-9]*$/.test(groupId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
    .toString();
  const deleteGroupQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/group.sql"))
    .toString();
  const deleteUsersQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/users.sql"))
    .toString();

  try {
    const { rowCount } = await client.query(getAdminQuery, [ownerId, groupId]);
    if (rowCount == 0) res.status(403).json("no-permission");
    await client.query(deleteGroupQuery, [groupId]);
    await client.query(deleteUsersQuery, [groupId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { groupId } = req.body;

  const getMembersQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/members.sql"))
    .toString();

  try {
    const { rows: members } = await client.query(getMembersQuery, [groupId]);

    res.status(200).json({ members });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/relation/change", async (req, res) => {
  const { subId, relation, groupId } = req.body;

  if (
    !/^[\d]*$/.test(subId) ||
    !(relation === "member" || relation === "admin" || relation === "moderator")
  )
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const updateMemberRealtionQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/memberRelation.sql"))
    .toString();
  const getAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
    .toString();
  try {
    const { rows } = await client.query(getAdminQuery, [ownerId, groupId]);
    if (!rows[0].id) return res.status(403).json("no-permission");
    await client.query(updateMemberRealtionQuery, [relation, subId, groupId]);

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
  if (!name) return res.status(400).json("invalid-data");

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

router.post("/join", async (req, res) => {
  const { groupId } = req.body;
  if (!/^[\d]*$/.test(groupId)) return res.status(400).json("invalid-data");

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

router.post("/user/delete", async (req, res) => {
  const { subId, groupId } = req.body;
  if (!/^[\d]*$/.test(groupId) || !/^[\d]*$/.test(subId))
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getAdminQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
    .toString();
  const deleteMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/userByAdmin.sql"))
    .toString();

  try {
    const { rows: admin } = await client.query(getAdminQuery, [
      ownerId,
      groupId,
    ]);
    if (!admin[0].id) return res.status(403).json("no-permission");
    const { rows } = await client.query(deleteMemberQuery, [subId, groupId]);
    if (!rows[0].id) return res.status(404).json("member-does-not-exist");

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/leave", async (req, res) => {
  const { groupId } = req.body;
  if (!/^[\d]*$/.test(groupId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getAdminsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/admins.sql"))
    .toString();
  const deleteMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/user.sql"))
    .toString();

  try {
    const { rowCount, rows } = await client.query(getAdminsQuery, [groupId]);
    if (rowCount > 1 || rows[0].userId != ownerId) {
      await client.query(deleteMemberQuery, [groupId, ownerId]);

      res.status(200).json({ success: true });
    } else if (rowCount == 1) res.status(403).json("last-group-admin");
    else res.status(400).json("bad-request");
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invite", async (req, res) => {
  const { userId, targetId } = req.body;
  if (!/^[\d]*$/.test(userId) || !/^[\d]*$/.test(targetId))
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  res.status(200).json({ success: true });
  try {
    const inviteUserQuery = fs
      .readFileSync(path.join(__dirname, "./query/add/inviteUser.sql"))
      .toString();
    await client.query(inviteUserQuery, [targetId, userId, ownerId]);
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/accept", async (req, res) => {
  const { subscribeId } = req.body;
  if (!/^[\d]*$/.test(subscribeId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const acceptInvitationQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/memberStatus.sql"))
    .toString();
  try {
    await client.query(acceptInvitationQuery, [subscribeId, ownerId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/decline", async (req, res) => {
  const { subscribeId } = req.body;
  if (!/^[\d]*$/.test(subscribeId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const declineInvitationQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/invitation.sql"))
    .toString();

  try {
    await client.query(declineInvitationQuery, [subscribeId, ownerId]);

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
    limits: {
      fileSize: 200000,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        return cb(new Error("wrong file type"));
      }
      cb(null, true);
    },
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
      fileName = filename;
    }
    const { groupId } = req.body;
    if (!/^[\d]*$/.test(groupId)) {
      fs.unlinkSync(
        path.join(__dirname, `../../../public/static/images/${fileName}`)
      );
      return res.status(400).json("invalid-data");
    }

    const changeGroupPhotoQuery = fs
      .readFileSync(path.join(__dirname, "./query/update/groupPhoto.sql"))
      .toString();
    const getAdminQuery = fs
      .readFileSync(path.join(__dirname, "./query/get/admin.sql"))
      .toString();

    try {
      const { rowCount } = await client.query(getAdminQuery, [
        ownerId,
        groupId,
      ]);
      if (rowCount == 0) {
        fs.unlinkSync(
          path.join(__dirname, `../../../public/static/images/${fileName}`)
        );
        return res.status(403).json("no-permission");
      }
      await client.query(changeGroupPhotoQuery, [fileName, groupId]);
      res.status(200).json({ fileName });
    } catch {
      res.status(400).json("bad-request");
    }
  });
});

module.exports = router;
