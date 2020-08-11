const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/about", async (req, res) => {
  const { idFanpage } = req.body;

  const fanpageInfoQuery = `
  select a.*, b.name, b.date	
  from(select id_fanpage as "idFanpage", count(*) as "numberOfSubscribers" 
    from fanpage_users 
    where id_fanpage=$1 
    group by "idFanpage") as a
  inner join fanpages as b
  on a."idFanpage" = b.id
  `;

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

  const checkUserQuery = `select id as "idSub",role from fanpage_users where id_user=$1 and id_fanpage=$2`;

  try {
    const { rows } = await client.query(checkUserQuery, [idOwner, idFanpage]);
    const idSub = rows[0].idSub || null;
    const role = rows[0].role || null;
    res.status(200).json({ idSub, role });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { idFanpage } = req.body;

  const deleteFanpageQuery = "delete from fanpages where id=$1";
  const deleteFanpageUsersQuery =
    "delete from fanpage_users where id_fanpage=$1";

  try {
    await client.query(deleteFanpageQuery, [idFanpage]);
    await client.query(deleteFanpageUsersQuery, [idFanpage]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/member/get", async (req, res) => {
  const { idFanpage, from } = req.body;
  const getMembersQuery = `
  select a.id as "idSub", a.id_user as "idUser",a.role, b.first_name as "firstName", b.last_name as "lastName", b.photo 
  from fanpage_users as a
  inner join users as b
  on b.id = a.id_user
  where a.id_fanpage=$1
  limit 21 offset $2
  `;
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

  const updateMemberRealtionQuery = `update fanpage_users set role=$1 where id=$2`;

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
  let getFanpagesQuery;
  if (!keyWords) {
    getFanpagesQuery = `
  with idFanpages as(
    select b.id_fanpage
      from(select a.id_fanpage
      from fanpage_users as a
      where id_user=$1) as b
    left join(
      select a.id_fanpage
      from fanpage_users as a
      where id_user=$2) as c
    on c.id_fanpage = b.id_fanpage
    where c.id_fanpage is null
    )
  
  select a."idSub",a."idFanpage",a."numberOfSubscribes", b.name, b.description, b.photo
  from(select id as "idSub",id_user,id_fanpage as "idFanpage", count(*) over (partition by id_fanpage)  as "numberOfSubscribes"
      from fanpage_users 
      where id_fanpage in(
          select a.id_fanpage
          from fanpage_users as a
          where id_user=$1
        )
      )as a
  left join fanpages as b
  on a."idFanpage" = b.id
  where a.id_user=$2
  union
  select null as "idSub", b.*, fanpages.name, fanpages.description, fanpages.photo
  from(select a.id as "idFanpage", count(*) as "numberOfSubscribes"
      from(select fanpages.id 
         from fanpages
         left join fanpage_users on
         fanpages.id = fanpage_users.id_fanpage
         where fanpages.id in(select * from idFanpages)
        ) as a
      group by a.id) as b
  inner join fanpages on b."idFanpage" = fanpages.id
  limit 21 offset $3
  `;

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
    getFanpagesQuery = `
    with fanpageSorted as(
      select id from fanpages where lower(name) like($1)
    ),
    
    subscribedFanpages as (
    select id_fanpage as "idFanpage",count(*) as "numberOfSubscribes" from fanpage_users where id_fanpage in(select * from fanpageSorted) group by id_fanpage
    ),
    
    unSubscribedFanpages as(
    select id, 0 as  "numberOfSubscribes" from fanpageSorted where id not in (select "idFanpage" from subscribedFanpages )
    ),
    
    countedFanpages as(
    select * from subscribedFanpages
    union
    select * from unSubscribedFanpages
    )
    
    select a.*, b.id as "idSub", c.name, c.photo from countedFanpages as a
    left join fanpage_users  as b
    on a."idFanpage" = b.id_fanpage and b.id_user =$2
    inner join fanpages as c 
    on a."idFanpage" = c.id
    order by "idSub"
    limit 21 offset $3
    
  `;
    try {
      getFanpages = await client.query(getFanpagesQuery, [
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

  const deleteUserQuery = `delete from fanpage_users where id=$1`;

  try {
    await client.query(deleteUserQuery, [idSub]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
