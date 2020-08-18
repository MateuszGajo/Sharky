const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const {
  getFanpagesQuery,
  getSortedFanpagesQuery,
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
} = require("./query");

const router = express.Router();

router.post("/about", async (req, res) => {
  const { idFanpage } = req.body;

  try {
    const { rows: fanpageInfo } = await client.query(fanpageInfoQuery, [
      idFanpage,
    ]);

    res.status(200).json({ fanpageInfo: fanpageInfo[0] });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/enter", async (req, res) => {
  const { idFanpage } = req.body;

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
    const { rows } = await client.query(checkUserQuery, [idOwner, idFanpage]);
    if (!rows[0])
      return res.status(200).json({ id: null, idSub: null, role: null });

    const idSub = rows[0] ? rows[0].idSub : null;
    const role = rows[0] ? rows[0].role : null;
    const id = rows[0].id;
    res.status(200).json({ idSub, role, id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { idFanpage } = req.body;

  try {
    await client.query(deleteFanpageQuery, [idFanpage]);
    await client.query(deleteFanpageUsersQuery, [idFanpage]);
    await client.query(deleteFanpagePostsQuery, [idFanpage]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { idFanpage, from } = req.body;

  let result;
  try {
    result = await client.query(getMembersQuery, [idFanpage, from]);
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
  const { idSub, relation } = req.body;

  try {
    await client.query(updateMemberRealtionQuery, [relation, idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

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

  let getFanpages;
  if (!keyWords) {
    try {
      getFanpages = await client.query(getFanpagesQuery, [
        idUser,
        idOwner,
        from,
      ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    try {
      getFanpages = await client.query(getSortedFanpagesQuery, [
        `%${keyWords}%`,
        idOwner,

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

router.post("/user/add", async (req, res) => {
  const { idFanpage } = req.body;

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
      idFanpage,
      idUser,
      "user",
    ]);

    let id;

    if (!addUser[0]) {
      const { rows } = await client.query(getIdUserQuery, [idFanpage, idUser]);
      id = rows[0].id;
    } else id = addUser[0].id;

    res.status(200).json({ id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/delete", async (req, res) => {
  const { idSub, idFanpage, role } = req.body;

  let admins;
  if (role == "admin") {
    admins = await client.query(getFanpageAdminsQuery, [idFanpage]);
  }

  if (role != "admin" || admins.rowCount > 1) {
    try {
      await client.query(deleteUserQuery, [idSub]);

      res.status(200).json({ success: true });
    } catch {
      res.status(400).json("bad-request");
    }
  } else res.status(403).json("last-fanpage-admin");
});

module.exports = router;
