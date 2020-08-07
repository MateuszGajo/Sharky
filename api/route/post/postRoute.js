const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const {
  getPostsQuery,
  getFanpagePostsQuery,
  getGroupPostsQuery,
  getCommentsQuery,
  addGroupPostQuery,
  addFanpagePostQuery,
  addPostQuery,
} = require("./query");

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
    data: { id: idOwner },
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
    let newPost;
    try {
      if (idGroup)
        newPost = await client.query(addGroupPostQuery, [
          idOwner,
          idGroup,
          content,
          date,
          fileName,
        ]);
      else if (idFanpage)
        newPost = await client.query(addFanpagePostQuery, [
          idOwner,
          idFanpage,
          content,
          date,
          fileName,
        ]);
      else
        newPost = await client.query(addPostQuery, [
          idOwner,
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
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  let postsResult, commentsResult;

  try {
    if (idFanpage)
      postsResult = await client.query(getFanpagePostsQuery, [idFanpage, from]);
    else if (idGroup)
      postsResult = await client.query(getGroupPostsQuery, [idGroup, from]);
    else postsResult = await client.query(getPostsQuery, [idOwner, from]);

    const idPosts = [];
    for (let i = 0; i < postsResult.rows.length; i++) {
      idPosts.push(postsResult.rows[i].idPost);
    }
    commentsResult = await client.query(getCommentsQuery, [idPosts, idOwner]);
  } catch {
    res.status(400).json("bad-request");
  }

  let isMorePosts = true;
  let isMoreComments = true;

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
