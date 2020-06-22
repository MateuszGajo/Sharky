const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idComment, content } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        idUser: "1",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { idUser } = decoded.data;

  const addReplyQuery = `
      INSERT INTO comment_replies(id_comment, id_user, content) values($1,$2,$3) RETURNING id;
      `;
  try {
    const reply = await client.query(addReplyQuery, [
      idComment,
      idUser,
      content,
    ]);
    console.log(reply);
    res.status(200).json({ id: reply.rows[0].id, idUser });
  } catch {
    res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { idComment, from } = req.body;
  console.log(idComment, from);
  const replyQuery = `
  select *
  from comment_replies
  where id_comment =$1
  order by id desc
  limit 21 offset $2
`;
  try {
    const replies = await client.query(replyQuery, [idComment, from]);

    res
      .status(200)
      .json({
        replies: replies.rows.slice(0, -1),
        isMore: replies.rows.length == 21,
      });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
