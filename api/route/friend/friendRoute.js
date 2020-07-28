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

router.post("/get/people", async (req, res) => {
  const { idUser, from } = req.body;
  let { keyWords } = req.body;
  if (keyWords) keyWords = keyWords.split(/\s+/);
  if (keyWords.length > 2)
    return res.status(200).json({ friends: [], isMore: false });

  let getFriendsQuery;
  let result;
  console.log(keyWords);
  if (!keyWords) {
    getFriendsQuery = `
  select c.*, friend_relation.relation, 	users.first_name as "firstName", users.last_name as "lastName", users.photo
  from(select b.*, friends.id as "idRelation"
    from(select a."idUser", sum(a.count) as "numberOfFriends"
      from(select id_user_1 as "idUser", count(*) over (partition by id_user_1) as "count" 
        from friends 
        where id_user_1 in(		
            select id_user_1
            from friends 
            where id_user_2=$1
            union
            select id_user_2
            from friends 
            where id_user_1=$1
            )
        union
        select id_user_2 as "user", count(*) over (partition by id_user_2) as "count" 
        from friends 
        where id_user_2 in(		
            select id_user_1
            from friends 
            where id_user_2=$1
            union
            select id_user_2
            from friends 
            where id_user_1=$1
            )
        ) as a
      group by a."idUser") as b
    inner join friends on friends.id_user_1 = b."idUser" and friends.id_user_2 = $1
    union
    select b.*, friends.id as "idRelation"
    from(select a."idUser", sum(a.count) as "numberOfFriends"
      from(select id_user_1 as "idUser", count(*) over (partition by id_user_1) as "count" 
        from friends 
        where id_user_1 in(		
            select id_user_1
            from friends 
            where id_user_2=$1
            union
            select id_user_2
            from friends 
            where id_user_1=$1
            )
        union
        select id_user_2 as "user", count(*) over (partition by id_user_2) as "count" 
        from friends 
        where id_user_2 in(		
            select id_user_1
            from friends 
            where id_user_2=$1
            union
            select id_user_2
            from friends 
            where id_user_1=$1
            )
        ) as a
      group by a."idUser") as b
    inner join friends on friends.id_user_2 = b."idUser" and friends.id_user_1 = $1) as c
  left join users on users.id = c."idUser"
  left join friend_relation on friend_relation.id_friendship = c."idRelation"
  limit 21 offset $2
  `;
    try {
      result = await client.query(getFriendsQuery, [idUser, from]);
    } catch {
      return res.status(400).json("bad-request");
    }
  } else {
    getFriendsQuery = `
    with idUsers as(
      select id_user_1 as "idUser"
      from friends 
      where id_user_2=$1
      union
      select id_user_2 as "idUser"
      from friends 
      where id_user_1=$1
      )

    select d.*	
    from(select a."idUser", sum(a."numberOfFriends") as "numberOfFriends", null as "idRelation", null as "relation", users.first_name as "firstName", users.last_name as "lastName", users.photo	
    from(select  id_user_2 as "idUser", count(id_user_2) as "numberOfFriends"
      from friends 
      where id_user_2 in
            (select id from users
            where (lower(users.first_name)  like lower($3) and lower(users.last_name) like lower($4) or lower(users.first_name)  like lower($4) and lower(users.last_name) like lower($3))
            and id not in(select "idUser" from idUsers)
            )
      group by id_user_2
      union
      select  id_user_1 as "idUser", count(id_user_1) as "numberOfFriends"
      from friends 
      where id_user_1 in
            (select id from users
            where (lower(users.first_name)  like lower($3) and lower(users.last_name) like lower($4) or lower(users.first_name)  like lower($4) and lower(users.last_name) like lower($3))
            and id not in(select "idUser" from idUsers)
            )
      group by id_user_1
      union
      select id,0 as "numberOfFriends" 
      from users
      where (lower(users.first_name)  like lower($3) and lower(users.last_name) like lower($4) or lower(users.first_name)  like lower($4) and lower(users.last_name) like lower($3))
      and id not in(select "idUser" from idUsers)
      ) as a
    left join users on a."idUser" = users.id 
    group by a."idUser", users.first_name, users.last_name, users.photo
    union
      select c.*, friend_relation.relation, 	users.first_name as "firstName", users.last_name as "lastName", users.photo
      from(select b.*, friends.id as "idRelation"
      from(select a."idUser", sum(a.count) as "numberOfFriends"
        from(select id_user_1 as "idUser", count(*) over (partition by id_user_1) as "count" 
        from friends 
        where id_user_1 in(	select "idUser" from idUsers )
        union
        select id_user_2 as "user", count(*) over (partition by id_user_2) as "count" 
        from friends 
        where id_user_2 in(select "idUser" from idUsers )
        ) as a
        group by a."idUser") as b
      inner join friends on friends.id_user_1 = b."idUser" and friends.id_user_2 = $1
      union
      select b.*, friends.id as "idRelation"
      from(select a."idUser", sum(a.count) as "numberOfFriends"
        from(select id_user_1 as "idUser", count(*) over (partition by id_user_1) as "count" 
        from friends 
        where id_user_1 in(	select "idUser" from idUsers )
        union
        select id_user_2 as "user", count(*) over (partition by id_user_2) as "count" 
        from friends 
        where id_user_2 in(	select "idUser" from idUsers)
        ) as a
        group by a."idUser") as b
      inner join friends on friends.id_user_2 = b."idUser" and friends.id_user_1 = $1) as c
      left join users on users.id = c."idUser"
      left join friend_relation on friend_relation.id_friendship = c."idRelation"
      where lower(users.first_name)  like lower($3) and lower(users.last_name) like lower($4) or lower(users.first_name)  like lower($4) and lower(users.last_name) like lower($3)
    ) as d
    order by d."idRelation", d."firstName"
    limit 21 offset $2
  `;
    try {
      result = await client.query(getFriendsQuery, [
        idUser,
        from,
        keyWords[0] + "%",
        keyWords[1] ? keyWords[1] : "" + "%",
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
  const { idRelation, idUser, relation } = req.body;

  const updateRelationQuery = `update friend_relation set new_relation=$1, id_user=$2 where id_friendship=$3;`;

  try {
    await client.query(updateRelationQuery, [relation, idUser, idRelation]);
    res.status(200);
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
