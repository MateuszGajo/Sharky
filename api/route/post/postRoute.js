const express = require("express");
const jwt = require("jsonwebtoken");
const { clinet, client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const { route } = require("next/dist/next-server/server/router");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { content, date, photo } = req.body;
  // const token = req.cookies.token || null;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        userId: "1",
        firstName: "Janek",
        lastName: "Kowalski",
        userPhoto: "profile.png",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { userId, firstName, lastName, userPhoto } = decoded.data;

  const addPostQuery =
    "insert into posts(id_user, content, date, photo) values($1, $2, $3, $4) RETURNING id";
  try {
    const newPost = await client.query(addPostQuery, [
      userId,
      content,
      date,
      photo,
    ]);

    if (newPost.rowCount == 0) {
      return res.status(400);
    }

    return res.json({
      success: true,
      user: { id: userId, firstName, lastName, photo: userPhoto },
      postId: newPost.rows[0].id,
    });
  } catch {
    return res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { from } = req.body;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        userId: "1",
        firstName: "Janek",
        lastName: "Kowalski",
        userPhoto: "profile.png",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { userId } = decoded.data;

  try {
    const getPostsQuery = `
    select posts.id, posts.id_user as "idUser", post_comments.content, photo, date, post_like.id as "idLike", post_comments.content
    from posts
    LEFT JOIN post_like on posts.id = post_like.id_post
    LEFT JOIN post_comments on posts.id = post_comments.id_post
    where posts.id_user in(
      SELECT $1 AS id_user_1
      UNION
      SELECT id_user_1  fROM friends where id_user_2=$1
      UNION
      SELECT id_user_2 fROM friends where id_user_1=$1)
    limit 20 OFFSET $2;`;

    const getCommentsQuery = `
    select id, id_post as "idPost", id_user as "idUser", content from post_comments
    where id_post between $1 and $2
    `

    const getCommentsReplyQuery = `
      select id, id_comment as "idComment", id_user as "idUser", content from comment_replies
      where id_comment IN(
        select id from post_comments
        where id_post between $1 and $2
      )
    `
    const posts = await client.query(getPostsQuery, [userId, from]);
    const comments = await client.query(getCommentsQuery, [from, from + 20]);
    const replies = await client.query(getCommentsReplyQuery, [from, from + 20]);

    return res.json({ posts: posts.rows, comments: comments.rows, replies: replies.rows });
  } catch {
    return res.status(400);
  }
});

module.exports = router;
