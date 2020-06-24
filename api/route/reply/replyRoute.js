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

    return res.status(200).json({ id: reply.rows[0].id, idUser });
  } catch {
    return res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { idReply, from } = req.body;
  const replyQuery = `
  select comment_replies.*, reply_like.id as "idLike" 
  from comment_replies
  left join reply_like on comment_replies.id = reply_like.id_reply
  where comment_replies.id_comment=$1
  order by id desc
  limit 21 offset $2
`;

  let result;

  try {
    result = await client.query(replyQuery, [idComment, from]);
  } catch {
    return res.status(400).json("bad-request");
  }

  let { rows: replies } = result;

  let isMore = true;
  if ((replies.rows.length = !21)) {
    isMore = false;
  }
  {
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
  insert into reply_like(idReply, idUser)
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
