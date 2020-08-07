const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/enter", async (req, res) => {
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
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  const enterQuery = `
  select a.name,b.id
  from (select id,name from groups where id = $1) as a
  left join(
  select id,id_group from group_users where id_group=$1 and id_user=$2) as b
  on a.id = b.id_group
  
  `;

  try {
    const { rows: info } = await client.query(enterQuery, [idGroup, idOwner]);
    const idMember = info[0].id || null;
    const name = info[0].name || null;

    res.status(200).json({ idMember, name });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/about", async (req, res) => {
  const { idGroup } = req.body;

  const getInfoQuery = `
  select name, date, b."numberOfMembers" 
  from groups as a 
  inner join(
  select id_group, count(*) as "numberOfMembers" from group_users where id_group=$1 group by id_group) as b
  on a.id = b.id_group`;

  try {
    const { rows: info } = await client.query(getInfoQuery, [idGroup]);

    res.status(200).json({ groupInfo: info[0] });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/leave", async (req, res) => {
  const { idMember } = req.body;

  const leaveQuery = "delete from group_users where id=$1";

  try {
    await client.query(leaveQuery, [idMember]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).status("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { idGroup } = req.body;

  const getMembersQuery = `
  select b.first_name as "firstName",b.last_name as "lastName",b.id as "idUser",b.photo,a.role from group_users as a
  inner join users as b on b.id = a.id_user
  where a.id_group=$1
  `;
  try {
    const { rows: members } = await client.query(getMembersQuery, [idGroup]);

    res.status(200).json({ members });
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

  let getGroupsQuery;
  let getGroups;

  if (!keyWords) {
    getGroupsQuery = `
  with idGroups as(
    select b.id_group
      from(select a.id_group
      from group_users as a
      where id_user=$1) as b
    left join(
      select a.id_group
      from group_users as a
      where id_user=$2) as c
    on c.id_group = b.id_group
    where c.id_group is null
    )
    
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
    union
    select null as "idSub", b.*, groups.name, groups.description, groups.photo
    from(select a.id as "idGroup", count(*) as "numberOfMembers"
      from(select groups.id 
         from groups
         left join group_users on
         groups.id = group_users.id_group
         where groups.id in(select * from idGroups)
        ) as a
      group by a.id) as b
    inner join groups on b."idGroup" = groups.id
    limit 21 offset $3
  `;
    try {
      getGroups = await client.query(getGroupsQuery, [idUser, idOwner, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    getGroupsQuery = `
    with groupSorted as(
      select id from groups where lower(name) like($1)
    ),
    
    subscribedGroups as (
    select id_group as "idGroup",count(*) as "numberOfMembers" from group_users where id_group in(select * from groupSorted) group by id_group
    ),
    
    unSubscribedGroups as(
    select id, 0 as  "numberOfMembers" from groupSorted where id not in (select "idGroup" from  subscribedGroups )
    ),
    
    countedGroups as(
    select * from subscribedGroups
    union
    select * from unSubscribedGroups
    )
    
   
    select a.*, b.id as "idSub", c.name, c.photo from countedGroups as a
    left join group_users  as b
    on a."idGroup" = b.id_group and b.id_user =$2
    inner join groups as c 
    on a."idGroup" = c.id
    order by "idSub"
    limit 21 offset $3
  `;
    try {
      getGroups = await client.query(getGroupsQuery, [
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
