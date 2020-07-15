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

module.exports = router;
