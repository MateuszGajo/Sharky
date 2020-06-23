const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idPost, content } = req.body;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: "1",
        firstName: "Janek",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { id, firstName, lastName, photo } = decoded.data;

  const addCommentQuery = `
    INSERT INTO post_comments(id_post, id_user, content) values($1,$2,$3) RETURNING id;
    `;
  try {
    const comment = await client.query(addCommentQuery, [idPost, id, content]);
    res.status(200).json({
      user: {
        id,
        firstName,
        lastName,
        photo,
      },
      idPost: comment.rows[0].id,
    });
  } catch {
    console.log("catch");
    res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { from, idPost } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: "1",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { id } = decoded.data;
  commentsQuery = `
  select post_comments.*,comment_like.id as idLike, count(comment_replies.id_comment) as "numberOfReplies"
  from post_comments 
  left join comment_replies on post_comments.id = comment_replies.id_comment
  left join comment_like on post_comments.id = comment_like.id_comment and comment_like.id_user =1
  where id_post=$1 and comment_like.id_user = $2
  group by post_comments.id, comment_like.id
  order by post_comments.id desc
  limit 21 offset $3
  `;
  let result;
  try {
    result = await client.query(commentsQuery, [idPost, id, from]);
  } catch {
    return res.status(400).json("bad-request");
  }

  let { rows: comments } = result;
  console.log(comments);
  let isMore = true;
  if (comments.length != 21) {
    isMore = false;
  } else {
    comments = comments.slice(0, -1);
  }
  return res.status(200).json({
    comments,
    isMore,
  });
});

module.exports = router;
