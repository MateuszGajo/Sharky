const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const {
  getFanpagesQuery,
  getSortedFanpagesQuery,
  getSortedSubscribedFanpagesQuery,
  addUserQuery,
  deleteUserQuery,
  getIdUserQuery,
} = require("./query");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, idUser, keyWords, onlySubscribed } = req.body;

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
      if (onlySubscribed)
        getFanpages = await client.query(getSortedSubscribedFanpagesQuery, [
          idUser,
          `%${keyWords}%`,
          idOwner,
          from,
        ]);
      else
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
  const { idSub } = req.body;

  try {
    await client.query(deleteUserQuery, [idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
