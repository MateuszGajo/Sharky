const express = require("express");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const {
  getGroupsQuery,
  getSortedGroupsQuery,
  getSortedSubscribedGroupsQuery,
  addUserQuery,
  deleteUserQuery,
  inviteUserQuery,
  getIdUserQuery,
  getMembersQuery,
  getInfoQuery,
  enterQuery,
  acceptInvitationToGroup,
  declineInvitationToGroup,
  getuserIDQuery,
  createGroupQuery,
  addAdminQuery,
  changeGroupPhotoQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/enter", async (req, res) => {
  const { groupId } = req.body;

  const { id: ownerId } = decodeToken(req);

  try {
    const { rows: info } = await client.query(enterQuery, [groupId, ownerId]);

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

  try {
    const { rows: info } = await client.query(getInfoQuery, [groupId]);
    res
      .status(200)
      .json({ numberOfMembers: info[0].numberOfMembers, date: info[0].date });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/leave", async (req, res) => {
  const { memberId, groupId, role } = req.body;

  let admins;

  if (role == "admin") {
    const getAdminsQuery =
      "select * from group_users where group_id=$1 and role='admin'";

    admins = await client.query(getAdminsQuery, [groupId]);
  }

  if (role != "admin" || admins.rowCount > 1) {
    const leaveQuery = "delete from group_users where id=$1";

    try {
      await client.query(leaveQuery, [memberId]);

      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  } else {
    res.status(403).json("last-group-admin");
  }
});

router.post("/delete", async (req, res) => {
  const { groupId } = req.body;

  const deleteGroupQuery = ` delete from groups where id=$1; `;

  const deleteUserQuery = "delete from group_users where group_id =$1;";

  try {
    await client.query(deleteGroupQuery, [groupId]);
    await client.query(deleteUserQuery, [groupId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { groupId } = req.body;

  try {
    const { rows: members } = await client.query(getMembersQuery, [groupId]);

    res.status(200).json({ members });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from, userId, keyWords, onlySubscribed } = req.body;
  const { id: onwerId } = decodeToken(req);

  let getGroups;

  if (!keyWords) {
    try {
      getGroups = await client.query(getGroupsQuery, [userId, onwerId, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getGroups = await client.query(getSortedSubscribedGroupsQuery, [
          userId,
          `%${keyWords}%`,
          onwerId,
          from,
        ]);
      else
        getGroups = await client.query(getSortedGroupsQuery, [
          `%${keyWords}%`,
          onwerId,
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

  const { id: onwerId } = decodeToken(req);
  const date = new Date();

  try {
    const { rows } = await client.query(createGroupQuery, [
      name,
      description,
      date,
    ]);
    await client.query(addAdminQuery, [rows[0].id, onwerId, date]);

    res.status(200).json({ id: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/add", async (req, res) => {
  const { groupId } = req.body;

  const { id: onwerId } = decodeToken(req);

  const role = "member";
  const date = new Date();

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      groupId,
      onwerId,
      role,
      date,
    ]);

    let id;
    if (!addUser[0]) {
      const { rows } = await client.query(getuserIDQuery, [groupId, onwerId]);
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
  const { subId } = req.body;

  try {
    await client.query(deleteUserQuery, [subId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invite", async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    const a = await client.query(inviteUserQuery, [targetId, userId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/accept", async (req, res) => {
  const { idSubscribe } = req.body;
  try {
    await client.query(acceptInvitationToGroup, [idSubscribe]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invitation/decline", async (req, res) => {
  const { idSubscribe } = req.body;

  try {
    await client.query(declineInvitationToGroup, [idSubscribe]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
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
    const { groupId } = req.body;

    try {
      await client.query(changeGroupPhotoQuery, [fileName, groupId]);
      res.status(200).json({ fileName });
    } catch {
      res.status(400).json("bad-request");
    }
  });
});

module.exports = router;
