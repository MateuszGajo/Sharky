const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { from, idUser } = req.body;

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

  const getGroupsQuery = `
  select a."idSub",a."idGroup",a."numberOfMembers", b.name, b.description, b.photo
  from(select id as "idSub",id_group as "idGroup", count(*) over (partition by id_group)  as "numberOfMembers",id_user
      from group_users 
      where id_group in(
          select a.id_group
          from group_users as a
          where id_user=$1
        )
      ) as a
  left join groups as b
  on a."idGroup" = b.id
  where a.id_user =$2
  limit 21 offset $3
  `;

  let getGroups;
  try {
    getGroups = await client.query(getGroupsQuery, [idUser, idOwner, from]);
  } catch {
    return res.status(400).json("bad-request");
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

  const addUserQuery = `insert into group_users(id_group, id_user) values($1,$2) returning id`;

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      idGroup,
      idUser,
    ]);

    res.status(200).json({ id: addUser[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/user/delete", async (req, res) => {
  const { idSub } = req.body;

  const deleteUserQuery = `delete from group_users where id=$1`;

  try {
    await client.query(deleteUserQuery, [idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
