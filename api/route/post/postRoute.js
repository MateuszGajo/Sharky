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
  select fourthResult.*, post_like.id as "idLike" 
  from(select  thirdResult.id, thirdResult.numberofshares as "numberOfShares",thirdResult.numberofcomments as "numberOfComments",thirdResult.numberoflikes as "numberOfLikes", posts.id_user as "idUser", posts.content, posts.photo, posts.date, null as "idShare", null as "idUserShare"
    from(select secondResult.*, count(post_like.id_post) as "numberoflikes"
      from(select firstResult.*, count(post_comments.id_post) as "numberofcomments" 
        from(select posts.id, count(post_share.id_post) as "numberofshares"
          from posts
            left join post_share on posts.id = post_share.id_post
          group by posts.id) as firstResult
        left join post_comments on  firstResult.id= post_comments.id_post
        group by firstResult.id, firstResult.numberofshares) as secondResult
      left join post_like on secondResult.id = post_like.id_post
      group by secondResult.id, secondResult.numberofshares, secondResult.numberofcomments) as thirdResult
    left join posts on posts.id = thirdResult.id
    where posts.id_user 
    in(SELECT $1 AS id_user_1
          union
          select id_user_1  from friends where id_user_2=$1
          union
          select id_user_2 from friends where id_user_1=$1)
    union
    select  thirdResult.*, posts.id_user as "idUser", posts.content, posts.photo, posts.date, post_share.id as "idShare", post_share.id_user as "idShareUser"
    from(select secondResult.*, count(post_like.id_post) as "numberoflikes"
      from(select firstResult.*, count(post_comments.id_post) as "numberofcomments" 
        from(select posts.id, count(post_share.id_post) as "numberofshares"
          from posts
            left join post_share on posts.id = post_share.id_post
          group by posts.id) as firstResult
        left join post_comments on  firstResult.id= post_comments.id_post
        group by firstResult.id, firstResult.numberofshares) as secondResult
      left join post_like on secondResult.id = post_like.id_post
      group by secondResult.id, secondResult.numberofshares, secondResult.numberofcomments) as thirdResult
    left join posts on posts.id = thirdResult.id
    inner join post_share on thirdResult.id = post_share.id_post
    where posts.id_user 
    in(SELECT $1 AS id_user_1
          union
          select id_user_1  from friends where id_user_2=$1
          union
          select id_user_2 from friends where id_user_1=$1)
    ) as fourthResult
  left join post_like on fourthResult.id = post_like.id_post and post_like.id_user = $1
  order by date desc
  limit 21 offset $2
    `;

  const getCommentsQuery = `
  
  select sresult.id, sresult.id_post as "idPost", sresult.id_user as "idUser", sresult.count as "number", sresult.content, sresult.date
  from(
    select result.count, post_comments.*, row_number() OVER (partition by post_comments.id_post order by date desc) as rn
        from(
        SELECT  count(id_post), id_post
        FROM post_comments
        where id_post = any($1)
        group by id_post) as result
  left join post_comments on post_comments.id_post = result.id_post) as sresult
  where rn <= 3
  `;

  let postsResult, commentsResult;
  let isMorePosts,
    isMoreComments = true;
  try {
    postsResult = await client.query(getPostsQuery, [idUser, from]);
    const idPosts = [];
    for (let i = 0; i < postsResult.rows.length; i++) {
      idPosts.push(postsResult.rows[i].id);
    }
    commentsResult = await client.query(getCommentsQuery, [idPosts]);
  } catch {
    console.log("err");
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
