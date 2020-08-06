const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
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

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/static/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({ storage }).single("file");

  await upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json("bad-request");
    }

    const {
      file: { mimetype, filename: fileName, size },
    } = req;
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(415).json("wrong-file-type");
    }
    if (size > 200000) {
      return res.status(413).json("file-too-large");
    }

    const { content, date, idGroup, idFanpage } = req.body;
    if (idGroup) {
      const addPostQuery =
        "insert into posts(id_user,id_group, content, date, photo) values($1, $2, $3, $4, $5) RETURNING id";

      try {
        const newPost = await client.query(addPostQuery, [
          1,
          idGroup,
          content,
          date,
          fileName,
        ]);
        return res.status(200).json({
          idPost: newPost.rows[0].id,
          fileName,
        });
      } catch {
        return res.status(400).json("bad-request");
      }
    } else if (idFanpage) {
      const addPostQuery =
        "insert into posts(id_user,id_fanpage, content, date, photo) values($1, $2, $3, $4, $5) RETURNING id";

      try {
        const newPost = await client.query(addPostQuery, [
          1,
          idFanpage,
          content,
          date,
          fileName,
        ]);
        return res.status(200).json({
          idPost: newPost.rows[0].id,
          fileName,
        });
      } catch {
        return res.status(400).json("bad-request");
      }
    } else {
      const addPostQuery =
        "insert into posts(id_user, content, date, photo) values($1, $2, $3, $4) RETURNING id";

      try {
        const newPost = await client.query(addPostQuery, [
          1,
          content,
          date,
          fileName,
        ]);
        return res.status(200).json({
          idPost: newPost.rows[0].id,
          fileName,
        });
      } catch {
        return res.status(400).json("bad-request");
      }
    }
  });
});

router.post("/get", async (req, res) => {
  const { from, idFanpage, idGroup } = req.body;
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

  const getPostsQuery = `
  with idUsers as(
    SELECT 1 AS "idUser"
    union
    select id_user_1 as "idUser"  from friends  where id_user_2=$1 and id_user_1 not in (select id_user_2 from user_mute where id_user_1=$1)
    union 
    select id_user_2 as "idUser" from friends where id_user_1=$1 and id_user_2 not in (select id_user_2 from user_mute where id_user_1=$1)
    ),
    
    idPosts as(
    select id as "idPost" from posts where id_user in(select * from idUsers) and id_group is null and id_fanpage is null
    
    ),
    
    idPostShare as (
    select id_post as "idPost" from post_share where id_user in(select * from idUsers)
    ),
    
    idPostAndShare as(
    select * from idPosts
    union
    select * from idPostShare
    ),
    
    numberOfShare as(
    select id_post as "idPost", count(*) as "numberOfShares" from post_share where id_post in(select * from idPostAndShare) group by id_post
    ),
    
    numberOfComments as(
    select id_post as "idPost", count(*) as "numberOfComments" from post_comments where id_post in(select * from idPostAndShare) group by id_post
    ),
    
    numberOfLikes as(
    select id_post as "idPost", count(*) as "numberOfLikes" from post_like where id_post in(select * from idPostAndShare) group by id_post
    ),
    
    postsShare as (
    select a.id_post as "idPost", c."numberOfShares", d."numberOfComments", e."numberOfLikes",b.id_user as "idUser",b.content,b.photo,a.date , a.id::text as "idShare", a.id_user::text as "idUserShare" 
    from post_share as a
    inner join posts as b on a.id_post = b.id
    inner join numberOfShare as c on a.id_post =c."idPost"
    inner join numberOfComments as d on a.id_post =d."idPost"
    inner join numberOfLikes as e on a.id_post =e."idPost"
    where id_post  in (select * from idPostShare)
    ),
    posts as (
    select a.id as "idPost",b."numberOfShares", c."numberOfComments",d."numberOfLikes",a.id_user as "idUser", a.content, a.photo, a.date, null as "idShare", null as "idUserShare" from 
    posts as a
    inner join numberOfShare as b on a.id =b."idPost"
    inner join numberOfComments as c on a.id =c."idPost"
    inner join numberOfLikes as d on a.id =d."idPost"
    where id in(select * from idPosts)
    )
    
    select a.*
    from(select * from postsShare
      union all
      select * from posts) as a
    order by date desc
    limit 21 offset $2
 `;

  if (idFanpage) {
    const query = `
   with idPosts as(
    select id  as "idPost" from posts where id_fanpage=$1
    ),
    
    numberOfShares as(
    select a."idPost", count(b.id) as "numberOfShares" from idPosts as a  left join post_share as  b on a."idPost" = b.id_post group by a."idPost"
    ),
    
    numberOfComments as(
    select a."idPost", count(b.id) as "numberOfComments" from idPosts as a  left join post_comments as  b on a."idPost" = b.id_post group by a."idPost"
    ),
    
    numberOfLikes as(
    select a."idPost", count(b.id) as "numberOfLikes" from idPosts as a  left join post_like as  b on a."idPost" = b.id_post group by a."idPost"
    )
    
    select e.*
    from(select a.id as "idPost", a.id_user as "idUser", a.content, a.photo, a.date, b."numberOfShares", c."numberOfComments", d."numberOfLikes",null as "idShare", null as "idUserShare"  
      from posts as a
      inner join numberOfShares as b on a.id = b."idPost"
      inner join numberOfComments as c on a.id=c."idPost"
      inner join numberOfLikes as d on a.id =d."idPost"
      where id in (select * from idPosts)) as e
    order by e.date
    limit 21 offset $2
   `;
  }

  const getCommentsQuery = `
  
  select d.id, d.count, d.numeroflikes as "numberOfLikes", d.numberofreplies as "numberOfReplies", post_comments.id_post as "idPost", post_comments.id_user as "idUser", post_comments.content, post_comments.date, comment_like.id as "idLike"	
  from(select c.*, count(comment_replies.id_comment) as "numberofreplies"
    from(select b.count, b.id,count(comment_like.id_comment) "numeroflikes"
        from(
        select a.count, post_comments.id, row_number() OVER (partition by post_comments.id_post order by date desc) as rn
          from(
          SELECT  count(id_post), id_post
          FROM post_comments
          where id_post = any($1) and id_user not in(select id_user_2 from user_mute where id_user_1=$2)
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
  let isMorePosts = true;
  let isMoreComments = true;

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
        id: 1,
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
        id: 1,
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
