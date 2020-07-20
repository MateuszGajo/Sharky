const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { idUser, from } = req.body;
  const getFanpagesQuery = `
  select a.*, b.name, b.description, b.photo
  from(select id_fanpage as "idFanpage", count(id)  as "numberOfSubscribes"
    from fanpage_users 
    where id_fanpage in(
      select a.id_fanpage
      from fanpage_users as a
      where id_user=$1
    )
    group by id_fanpage
  ) as a
  left join fanpages as b
  on a."idFanpage" = b.id
  limit 21 offset $2
  `;

  let getFanpages;
  try {
    getFanpages = await client.query(getFanpagesQuery, [idUser, from]);
  } catch {
    return res.status(400).json("bad-request");
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
  const { idUser, idFanpage } = req.body;

  const addUserQuery = `insert into fanpage_users(id_fanpage, id_user) values($1,$2) returning id`;

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      idFanpage,
      idUser,
    ]);

    res.status(200).json({ id: addUser[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/delete", async (req, res) => {
  const { idSub } = req.body;
  console.log(idSub);

  const deleteUserQuery = `delete from fanpage_users where id=$1`;

  try {
    await client.query(deleteUserQuery, [idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
