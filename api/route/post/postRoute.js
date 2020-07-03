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
  from(
	  	select  thirdResult.id as "idPost", thirdResult.numberofshares as "numberOfShares",thirdResult.numberofcomments as "numberOfComments",thirdResult.numberoflikes as "numberOfLikes", posts.id_user as "idUser", posts.content, posts.photo, posts.date, null as "idShare", null as "idUserShare"
	  	from(
			  select secondResult.*, count(post_like.id_post) as "numberoflikes"
			  from(
            select firstResult.*, count(post_comments.id_post) as "numberofcomments" 
            from(
              select posts.id, count(post_share.id_post) as "numberofshares"
              from posts
              left join post_share on posts.id = post_share.id_post
              group by posts.id) as firstResult
            left join post_comments on  firstResult.id= post_comments.id_post
            group by firstResult.id, firstResult.numberofshares) as secondResult
			  left join post_like on secondResult.id = post_like.id_post
			  group by secondResult.id, secondResult.numberofshares, secondResult.numberofcomments) as thirdResult
    	left join posts on posts.id = thirdResult.id
    	where posts.id_user 
      in(	
        SELECT $1 AS id_user_1
        union
        select id_user_1  
        from friends 
        where id_user_2=$1 and id_user_1 
        not in (select id_user_2 from mute_users where id_user_1=$1)
        union
        select id_user_2 
        from friends 
        where id_user_1=$1 and id_user_2 
        not in (select id_user_2 from mute_users where id_user_1=$1))
      union
      select  thirdResult.*, posts.id_user as "idUser", posts.content, posts.photo, posts.date, post_share.id as "idShare", post_share.id_user as "idShareUser"
      from(
          select secondResult.*, count(post_like.id_post) as "numberoflikes"
          from(
              select firstResult.*, count(post_comments.id_post) as "numberofcomments" 
              from(
                  select posts.id, count(post_share.id_post) as "numberofshares"
                  from posts
                  left join post_share on posts.id = post_share.id_post
                  group by posts.id) as firstResult
              left join post_comments on  firstResult.id= post_comments.id_post
              group by firstResult.id, firstResult.numberofshares) as secondResult
          left join post_like on secondResult.id = post_like.id_post
          group by secondResult.id, secondResult.numberofshares, secondResult.numberofcomments) as thirdResult
      left join posts on posts.id = thirdResult.id
      inner join post_share on thirdResult.id = post_share.id_post
      where post_share.id_user 
      in(	
      SELECT $1 AS id_user_1
        union
          select id_user_1  
          from friends 
          where id_user_2=$1 and id_user_1 
          not in (select id_user_2 from mute_users where id_user_1=$1)
        union
          select id_user_2 
          from friends 
          where id_user_1=$1 and id_user_2 
          not in (select id_user_2 from mute_users where id_user_1=$1))) as fourthResult
  left join post_like on "idPost" = post_like.id_post and post_like.id_user = $1
  order by date desc
  limit 21 offset $2`;

  const getCommentsQuery = `
  
  select d.id, d.count, d.numeroflikes as "numberOfLikes", d.numberofreplies as "numberOfReplies", post_comments.id_post as "idPost", post_comments.id_user as "idUser", post_comments.content, post_comments.date, comment_like.id as "idLike"	
  from(select c.*, count(comment_replies.id_comment) as "numberofreplies"
    from(select b.count, b.id,count(comment_like.id_comment) "numeroflikes"
        from(
        select a.count, post_comments.id, row_number() OVER (partition by post_comments.id_post order by date desc) as rn
          from(
          SELECT  count(id_post), id_post
          FROM post_comments
          where id_post = any($1)
          group by id_post
          ) as a
        left join post_comments on post_comments.id_post = a.id_post) as b
      left join comment_like on b.id = comment_like.id_comment
      where rn <= 3
      group by comment_like.id_comment, b.count, b.id) as c
    left join comment_replies on c.id = comment_replies.id_comment
    group by c.id, c.count, c.numeroflikes) as d
  left join post_comments on d.id = post_comments.id
  left join comment_like on d.id = comment_like.id_comment and comment_like.id_user = $2
  order by date desc
  `;

  let postsResult, commentsResult;
  let isMorePosts,
    isMoreComments = true;

  try {
    postsResult = await client.query(getPostsQuery, [idUser, from]);
    const idPosts = [];
    for (let i = 0; i < postsResult.rows.length; i++) {
      idPosts.push(postsResult.rows[i].idPost);
    }
    commentsResult = await client.query(getCommentsQuery, [idPosts, idUser]);
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

router.post("/share", async (req, res) => {
  const { idPost, date } = req.body;
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

  const postShareQuery = `insert into post_share(id_post, id_user, date) values($1,$2,$3) returning id`;

  try {
    const postShare = await client.query(postShareQuery, [
      idPost,
      idUser,
      date,
    ]);
    res.status(200).json({ idShare: postShare.rows[0].id, idUser });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/edit", async (req, res) => {
  const { idPost, content } = req.body;

  const editPostQuery = `update posts set content=$1 where id=$2`;

  try {
    await client.query(editPostQuery, [content, idPost]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { idPost } = req.body;

  const deletePostQuery = `delete from posts where id=$1`;

  try {
    await client.query(deletePostQuery, [idPost]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share/delete", async (req, res) => {
  const { idShare } = req.body;

  const deleteSharePostQuery = `delete from post_share where id=$1`;

  try {
    await client.query(deleteSharePostQuery, [idShare]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
