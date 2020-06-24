const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { content, date, photo } = req.body;
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

  const addPostQuery =
    "insert into posts(id_user, content, date, photo) values($1, $2, $3, $4) RETURNING id";
  try {
    const newPost = await client.query(addPostQuery, [
      idUser,
      content,
      date,
      photo,
    ]);

    return res.status(200).json({
      idUser,
      idPost: newPost.rows[0].id,
    });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from } = req.body;
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

  const getPostsQuery = `
  select result.*, post_like.id as "idLike" from (
    select posts.id, posts.id_user as "idUser", content, photo, date, null as "idShare", null as "idUserShare"
      from posts
      where posts.id_user in(
        SELECT $1 AS id_user_1
        UNION
        SELECT id_user_1  fROM friends where id_user_2=$1
        UNION
        SELECT id_user_2 fROM friends where id_user_1=$1)
      union
      select posts.id, posts.id_user, content, photo, post_share.date, post_share.id as "idShare", post_share.id_user as "idUserShare" from post_share
      LEFT JOIN posts on  posts.id= post_share.id_post) as result
  LEFT JOIN post_like on result.id = post_like.id_post and post_like.id_user = $1
  order by date desc
  limit 21 offset $2`;

  const getCommentsQuery = `
  select id, id_post as "idPost", id_user as "idUser", content, date from post_comments
  where id_post in($1)
  order by date desc
  limit 3 offset 0
  `;

  let postsResult, commentsResult;
  let isMorePosts,
    isMoreComments = true;

  try {
    posts = await client.query(getPostsQuery, [idUser, from]);

    const idPosts = [];
    for (let i = 0; i < posts.rows.length; i++) {
      idPosts.push(posts.rows[i].id);
    }

    comments = await client.query(getCommentsQuery, [idPosts]);
  } catch {
    return res.status(400).json("bad-request");
  }

  let { rows: posts } = postsResult;
  let { rows: comments } = commentsResult;

  if (posts.length != 21) {
    isMorePosts = false;
  } else {
    posts = posts.slice(0, -1);
  }

  if (comments.length != 3) {
    isMoreComments = false;
  } else {
    comments = comments.slice(0, -1);
  }

  return res.status(200).json({
    posts,
    comments,
    isMorePosts,
    isMoreComments,
  });
});

router.post("/like", async (req, res) => {
  const { idPost } = req.body;

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

  try {
    const postLikeQuery = `INSERT INTO post_like(id_user, id_post) VALUES($1,$2) returning id`;
    const postLike = await client.query(postLikeQuery, [idUser, idPost]);
    res.status(200).json({ idPostLike: postLike.rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { idLike } = req.body;

  try {
    const unLikeQuery = `delete from post_like where id=$1`;
    await client.query(unLikeQuery, [idLike]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
