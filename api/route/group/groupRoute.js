const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/get", async (req, res) => {
  const { idUser, from } = req.body;
  const getGroupsQuery = `
  select a.*, b.name, b.description, b.photo
  from(select id_group as "idGroup", count(id)  as "numberOfMembers"
    from group_users 
    where id_group in(
      select a.id_group
      from group_users as a
      where id_user=$1
    )
    group by id_group
  ) as a
  left join groups as b
  on a."idGroup" = b.id
  limit 21 offset $2
  `;

  let getGroups;
  try {
    getGroups = await client.query(getGroupsQuery, [idUser, from]);
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
  const { idUser, idGroup } = req.body;

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
