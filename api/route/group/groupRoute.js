const express = require("express");
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
  createGroupQuery,
  addAdminQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/enter", async (req, res) => {
  const { idGroup } = req.body;

  const { id: idOwner } = decodeToken(req);

  try {
    const { rows: info } = await client.query(enterQuery, [idGroup, idOwner]);

    if (!info[0]) {
      return res
        .status(200)
        .json({ idMember: null, name: null, role: null, id: null });
    }
    const id = info[0].id;
    const name = info[0].name;
    const idMember = info[0] ? info[0].idMember : null;
    const role = info[0] ? info[0].role : null;

    res.status(200).json({ id, idMember, name, role });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/about", async (req, res) => {
  const { idGroup } = req.body;

  try {
    const { rows: info } = await client.query(getInfoQuery, [idGroup]);
    res
      .status(200)
      .json({ numberOfMembers: info[0].numberOfMembers, date: info[0].date });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/leave", async (req, res) => {
  const { idMember, idGroup, role } = req.body;

  let admins;

  if (role == "admin") {
    const getAdminsQuery =
      "select * from group_users where id_group=$1 and role='admin'";

    admins = await client.query(getAdminsQuery, [idGroup]);
  }

  if (role != "admin" || admins.rowCount > 1) {
    const leaveQuery = "delete from group_users where id=$1";

    try {
      await client.query(leaveQuery, [idMember]);

      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  } else {
    res.status(403).json("last-group-admin");
  }
});

router.post("/delete", async (req, res) => {
  const { idGroup } = req.body;

  const deleteGroupQuery = ` delete from groups where id=$1; `;

  const deleteUserQuery = "delete from group_users where id_group =$1;";

  try {
    await client.query(deleteGroupQuery, [idGroup]);
    await client.query(deleteUserQuery, [idGroup]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { idGroup } = req.body;

  try {
    const { rows: members } = await client.query(getMembersQuery, [idGroup]);

    res.status(200).json({ members });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from, idUser, keyWords, onlySubscribed } = req.body;
  const { id: idOwner } = decodeToken(req);

  let getGroups;

  if (!keyWords) {
    try {
      getGroups = await client.query(getGroupsQuery, [idUser, idOwner, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      if (onlySubscribed)
        getGroups = await client.query(getSortedSubscribedGroupsQuery, [
          idUser,
          `%${keyWords}%`,
          idOwner,
          from,
        ]);
      else
        getGroups = await client.query(getSortedGroupsQuery, [
          `%${keyWords}%`,
          idOwner,
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

  const { id: idOwner } = decodeToken(req);
  const date = new Date();

  try {
    const { rows } = await client.query(createGroupQuery, [
      name,
      description,
      date,
    ]);
    await client.query(addAdminQuery, [rows[0].id, idOwner, date]);

    res.status(200).json({ id: rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/add", async (req, res) => {
  const { idGroup } = req.body;

  const { id: idOwner } = decodeToken(req);

  const role = "member";
  const date = new Date();

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      idGroup,
      idOwner,
      role,
      date,
    ]);

    let id;
    if (!addUser[0]) {
      const { rows } = await client.query(getIdUserQuery, [idGroup, idOwner]);
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
  const { idSub } = req.body;

  try {
    await client.query(deleteUserQuery, [idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/invite", async (req, res) => {
  const { idUser, idTarget } = req.body;

  try {
    const a = await client.query(inviteUserQuery, [idTarget, idUser]);
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

module.exports = router;
