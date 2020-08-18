const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const {
  getGroupsQuery,
  getSortedGroupsQuery,
  addUserQuery,
  deleteUserQuery,
  inviteUserQuery,
  getIdUserQuery,
} = require("./query");
const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, idUser, keyWords } = req.body;
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

  let getGroups;

  if (!keyWords) {
    try {
      getGroups = await client.query(getGroupsQuery, [idUser, idOwner, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
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

router.post("/user/add", async (req, res) => {
  const { idGroup } = req.body;

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
    const { rows: addUser } = await client.query(addUserQuery, [
      idGroup,
      idUser,
    ]);

    let id;
    if (!addUser[0]) {
      const { rows } = await client.query(getIdUserQuery, [idGroup, idUser]);
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

module.exports = router;
