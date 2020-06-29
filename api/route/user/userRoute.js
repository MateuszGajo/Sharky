const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { post } = require("../post/postRoute");
const { jwtSecret } = require("../../../config/keys");

router.post("/get", async (req, res) => {
  const { idUsers } = req.body;

  const getUserQuery = `select id, first_name as "firstName", last_name as "lastName", photo from users where id = ANY($1);`;

  try {
    const { rows: users } = await client.query(getUserQuery, [idUsers]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/mute", async (req, res) => {
  const { idMuteUser } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: "1",
      },
    },
    jwtSecret
  );

  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  const date = new Date();
  const muteUserQuery = `insert into mute_users(id_user_1, id_user_2, date) values($1, $2, $3)`;

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
        id: "1",
      },
    },
    jwtSecret
  );

  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  const removeFriendQuery = `
  delete from friends where id =
    (
    select id from friends where id_user_1=$1 and id_user_2=$2
    union
    select id from friends where id_user_1=$2 and id_user_2=$1
    )`;

  const blockUserQuery = `
  insert into user_block(id_user_1,id_user_2,date)
    values($1,$2,$3)
    `;

  try {
    await client.query(removeFriendQuery, [idUser, idBlockUser]);
    await client.query(blockUserQuery, [idUser, idBlockUser, date]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
