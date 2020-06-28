const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idComment, content, date } = req.body;

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

  const addReplyQuery = `
      INSERT INTO comment_replies(id_comment, id_user, content, date) values($1,$2,$3,$4) RETURNING id;
      `;
  try {
    const reply = await client.query(addReplyQuery, [
      idComment,
      idUser,
      content,
      date,
    ]);

    return res.status(200).json({ idReply: reply.rows[0].id, idUser });
  } catch {
    return res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { idComment, from } = req.body;

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

  const replyQuery = `
  select result.id, result.id_user as "idUser", result.content, result.date, result.numberoflikes as "numberOfLikes" ,reply_like.id as "idLike"  
  from(select comment_replies.*, count(reply_like.id_reply) as "numberoflikes"
    from comment_replies
    left join reply_like on comment_replies.id = reply_like.id_reply
    where comment_replies.id_comment=$1
    group by comment_replies.id, reply_like.id_reply) as result
  left join reply_like on result.id = reply_like.id_reply and reply_like.id_user = $2
  order by date desc
  limit 21 offset $3
  `;

  let result;

  try {
    result = await client.query(replyQuery, [idComment, idUser, from]);
  } catch {
    return res.status(400).json("bad-request");
  }
  let { rows: replies } = result;
  let isMore = true;

  if (replies.length != 21) {
    isMore = false;
  } else {
    replies = replies.slice(0, -1);
  }

  return res.status(200).json({
    replies,
    isMore,
  });
});

router.post("/like", async (req, res) => {
  const { idReply } = req.body;

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

  const likeReplyQuery = `
  insert into reply_like(id_reply, id_user)
  values($1,$2)
  returning id`;

  try {
    const replyLike = await client.query(likeReplyQuery, [idReply, idUser]);

    return res.status(200).json({ idReplyLike: replyLike.rows[0].id });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { idLike } = req.body;

  const unlikeReplyQuery = `
  delete from reply_like
  where id = $1;
  `;

  try {
    await client.query(unlikeReplyQuery, [idLike]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
