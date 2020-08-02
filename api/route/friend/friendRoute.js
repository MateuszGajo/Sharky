const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const router = express.Router();

router.get("/get", async (req, res) => {
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

  const getFriendsQuery = `
  select result.id_user_1 as "idUser", chats.id as "idChat", chats.message_to as "messageTo", users.first_name as "firstName", users.last_name as "lastName", users.photo
	from(select id_user_1 
        from friends 
        where id_user_2=$1
        union
        select id_user_2
        from friends 
        where id_user_1=$1) as result
	inner join chats on chats.id_user_1 = result.id_user_1 or chats.id_user_2 = result.id_user_1
	left join users on users.id = result.id_user_1
      `;

  try {
    const friends = await client.query(getFriendsQuery, [idUser]);
    res.status(200).json({ friends: friends.rows });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/add", async (req, res) => {
  const { idUser } = req.body;

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

  const addUserQuery = `
    insert into friends(id_user_1, id_user_2, status) values($1,$2,'0') returning id;
  `;

  try {
    const { rows: addUser } = await client.query(addUserQuery, [
      idOwner,
      idUser,
    ]);

    res.status(200).json({ idFriendShip: addUser[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/remove", async (req, res) => {
  const { idFriendShip } = req.body;

  const removeUserQuery = `
  delete from friends where id=$1;
  `;

  try {
    await client.query(removeUserQuery, [idFriendShip]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/accept", async (req, res) => {
  const { idFriendShip } = req.body;
  const relation = "friend";

  const acceptRequest = `update friends set status='1' where id=$1`;
  const setRelation = `insert into friend_relation(id_friendship, relation) values($1,$2) returning relation`;

  try {
    await client.query(acceptRequest, [idFriendShip]);
    await client.query(setRelation, [idFriendShip, relation]);

    res.status(200).json({ relation });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/get/people", async (req, res) => {
  const { idUser, from } = req.body;
  let { keyWords } = req.body;
  if (keyWords) {
    keyWords = keyWords.split(/\s+/);
    if (keyWords.length > 2)
      return res.status(200).json({ friends: [], isMore: false });
  }

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

  let getFriendsQuery;
  let result;

  if (!keyWords) {
    getFriendsQuery = `
      with userFriends as(
      select id_user_1 as "users" from friends where id_user_2=$1
      union
      select id_user_2 as "users" from friends where id_user_1=$1
      ),
      
      userFriendsCounted as(
      select id_user_1 as "idUser",count(id_user_1) as "numberOfFriends" from friends where id_user_1 in(select * from userFriends) group by id_user_1
      union
      select id_user_2 as "idUser",count(id_user_2) as "numberOfFriends" from friends where id_user_2 in(select * from userFriends) group by id_user_2
      ),
      
      friendsStatus as(
      select id_user_1 as "idUser",id as "idRelationShip",status,date from friends where id_user_1 in(select * from userFriends) and id_user_2 =$2
      union
      select id_user_2 as "idUser",id as "idRelationShip",status,date from friends where id_user_2 in(select * from userFriends) and id_user_1=$2
      )
      
      select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
      from(select a.*,b."numberOfFriends", c.relation 
        from friendsStatus as a 
        inner join userFriendsCounted as b on a."idUser" = b."idUser"
        left join friend_relation as c on a."idRelationShip"= c.id_friendship
        union
        select a."idUser",null as  idRelationShip,null as  status,null as  date,a."numberOfFriends",null as  relation from userFriendsCounted as a where a."idUser" not in (select "idUser" from friendsStatus)) as d
      inner join users as e on d."idUser" = e.id
      limit 21 offset $3	
  `;
    try {
      result = await client.query(getFriendsQuery, [idUser, idOwner, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    getFriendsQuery = `
    with userSorted as (
      select id from users 
      where (lower(first_name) like lower($1) and lower(last_name) like lower($2)) 
      or (lower(last_name) like lower($1) and lower(first_name) like lower($2))
      ),
      
      userSortedCounted as(
      select a."idUser",sum(a.count) as "numberOfFriends"
      from(select id_user_1 as "idUser", count(id_user_1)  from friends where id_user_1 in(select * from userSorted) group by "idUser"
        union 
        select id_user_2 as "idUser", count(id_user_2)  from friends where id_user_2 in(select * from userSorted) group by "idUser") as a
      group by a."idUser"
      ),
      
      userRelation as (
        select  id_user_1 as "idUser",id as "idFriendShip",status,date from friends where id_user_1 in (select * from userSorted) and id_user_2=$3
        union
        select id_user_2 as "idUser",id as "idFriendShip" ,status,date from friends where id_user_2 in (select * from userSorted) and id_user_1=$3
      )
      
      select d.*,e.first_name as "firstName", e.last_name as "lastName", e.photo
      from(select a.*,b.relation,c."numberOfFriends" 
         from userRelation as a 
         left join friend_relation as b on a."idFriendShip" =b.id_friendship 
         inner join userSortedCounted as c on  a."idUser" = c."idUser"
         union
         select a."idUser",null as "idFriendShip", null as status, null as date, null as relation, b."numberOfFriends" 
         from userSortedCounted as a 
         inner join userSortedCounted as b on  a."idUser" = b."idUser"
         where a."idUser" not in (select "idUser" from userRelation)
         union
         select id as "idUser", null as idFriendShip,null as status, null as date, null as relation,  0 as numberOfFriends
         from userSorted 
         where id not in (select "idUser" from userSortedCounted)) as d
      inner join users as e on d."idUser" = e.id
      limit 21 offset $4
  `;
    try {
      result = await client.query(getFriendsQuery, [
        keyWords[0] + "%",
        keyWords[1] ? keyWords[1] : "" + "%",
        idOwner,
        from,
      ]);
    } catch {
      return res.status(400).json("bad-request");
    }
  }

  let { rows: friends } = result;
  let isMore = true;

  if (friends.length < 21) {
    isMore = false;
  } else {
    friends = friends.slice(0, -1);
  }

  res.status(200).json({ friends, isMore });
});

router.post("/chat/join", (req, res) => {
  const { users } = req.body;
  const { io } = req;
  const session = req.session;

  for (let i = 0; i < users.length; i++) {
    io.sockets.connected[session.socketio].join(users[i].idChat);
  }

  res.status(200);
});

router.post("/message/read", (req, res) => {
  const { idChat } = req.body;

  const readMessageQuery = `update chats set message_to=null where id=$1;`;

  client.query(readMessageQuery, [idChat]);
});

router.post("/update/relation", async (req, res) => {
  const { idFriendShip, idUser, relation } = req.body;

  const updateRelationQuery = `update friend_relation set new_relation=$1, id_user=$2 where id_friendship=$3;`;

  try {
    await client.query(updateRelationQuery, [relation, idUser, idFriendShip]);
    res.status(200);
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
