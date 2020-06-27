const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idPost, content, date } = req.body;
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

  const addCommentQuery = `
    INSERT INTO post_comments(id_post, id_user, content, date) values($1, $2, $3, $4) RETURNING id;
    `;
  try {
    const comment = await client.query(addCommentQuery, [
      idPost,
      idUser,
      content,
      date,
    ]);
    return res.status(200).json({
      idUser,
      idComment: comment.rows[0].id,
    });
  } catch {
    return res.status(400).json("bad-request");
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
  const {
    data: { id: idUser },
  } = jwt.verify(token, jwtSecret);

  commentsQuery = `
  select secondResult.*, post_comments.id_user as "idUser", post_comments.content, post_comments.date , comment_like.id as "idLike"  from
	(select result.id, result.numberofreplies as "numberOfReplies", count(comment_like.id_comment) as "numberOfLikes"
	 from(select post_comments.id,  count(comment_replies.id) as "numberofreplies"
		  from post_comments
		  left join comment_replies on post_comments.id = comment_replies.id_comment
		  where id_post=$1
		  group by  post_comments.id) as result
	  left join comment_like on result.id = comment_like.id_comment
	  group by result.id,result.numberofreplies) as secondResult
  left join comment_like on secondResult.id = comment_like.id_comment and comment_like.id_user=$2
  left join post_comments on post_comments.id = secondResult.id
  order by post_comments.date desc
  limit 21 offset $3
  `;
  let result;
  try {
    result = await client.query(commentsQuery, [idPost, idUser, from]);
  } catch {
    return res.status(400).json("bad-request");
  }

  let { rows: comments } = result;
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

router.post("/like", async (req, res) => {
  const { idComment } = req.body;

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

  const likeCommentQuery = `
  insert into comment_like(id_comment, id_user)
  values($1,$2)
  returning id`;

  try {
    const commentLike = await client.query(likeCommentQuery, [
      idComment,
      idUser,
    ]);
    return res.status(200).json({ idCommentLike: commentLike.rows[0].id });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { idLike } = req.body;

  const unlikeCommentQuery = `
  delete from comment_like
  where id = $1;
  `;

  try {
    await client.query(unlikeCommentQuery, [idLike]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
