const express = require("express");
const multer = require("multer");
const { client } = require("../../../config/pgAdaptor");
const {
  getPostQuery,
  getPostsQuery,
  getUserPostQuery,
  getFanpagePostsQuery,
  getGroupPostsQuery,
  getNewsQuery,
  getCommentsQuery,
  addGroupPostQuery,
  addFanpagePostQuery,
  addPostQuery,
  addNewsQuery,
  postLikeQuery,
  unLikeQuery,
  postShareQuery,
  editPostQuery,
  deletePostQuery,
  deleteSharePostQuery,
  getIdPostQuery,
  doesUserBelongToFanpageQuery,
  doesUserBelongToGroupqQuery,
  deleteCommentsQuery,
  deleteRepliesQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { id: idOwner } = decodeToken(req);

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
    let fileName = null;
    if (req.file) {
      const {
        file: { mimetype, filename, size },
      } = req;
      fileName = filename;
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(415).json("wrong-file-type");
      }
      if (size > 200000) {
        return res.status(413).json("file-too-large");
      }
    }

    const { content, date, idGroup, idFanpage, news } = req.body;
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
      else if (news)
        newPost = await client.query(addNewsQuery, [
          idOwner,
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
  const { from, idFanpage, idGroup, news, idUser, authorPost } = req.body;
  const { id: idOwner } = decodeToken(req);

  let postsResult, commentsResult;

  try {
    if (idFanpage)
      postsResult = await client.query(getFanpagePostsQuery, [
        idFanpage,
        idOwner,
        from,
      ]);
    else if (idGroup)
      postsResult = await client.query(getGroupPostsQuery, [
        idGroup,
        idOwner,
        from,
      ]);
    else if (authorPost)
      postsResult = await client.query(getUserPostQuery, [
        idUser,
        idOwner,
        from,
      ]);
    else if (news)
      postsResult = await client.query(getNewsQuery, [idOwner, from]);
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

router.post("/get/single", async (req, res) => {
  const { idPost } = req.body;

  const { id: idOwner } = decodeToken(req);

  try {
    const { rows: post } = await client.query(getPostQuery, [idPost, idOwner]);
    if (!post[0]) return res.status(404).json("post-does-not-exist");

    if (post[0].idFanpage) {
      const { rows } = await client.query(doesUserBelongToFanpageQuery, [
        idUser,
      ]);
      if (!rows[0])
        return res.status(403).json("user-does-not-have-permission");
    }

    if (post[0].idGroup) {
      const { rows } = await client.query(doesUserBelongToGroupqQuery, [
        idUser,
      ]);
      if (!rows[0])
        return res.status(403).json("user-does-not-have-permission");
    }

    let { rows: comments } = await client.query(getCommentsQuery, [
      [post[0].idPost],
      idOwner,
    ]);

    let isMoreComments = true;

    if (comments.length < 3) {
      isMoreComments = false;
    } else {
      comments = comments.slice(0, -1);
    }

    res.status(200).json({ post: post[0], comments, isMoreComments });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/like", async (req, res) => {
  const { idPost } = req.body;

  const { id: idOwner } = decodeToken(req);

  try {
    const { rows: newLike } = await client.query(postLikeQuery, [
      idOwner,
      idPost,
    ]);

    let idLike;

    if (!newLike[0]) {
      const { rows } = await client.query(getIdPostQuery, [idOwner, idPost]);
      idLike = rows[0].id;
    } else idLike = newLike[0].id;

    res.status(200).json({ idLike });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { idLike } = req.body;

  try {
    await client.query(unLikeQuery, [idLike]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share", async (req, res) => {
  const { idPost, date } = req.body;
  const { id: idOwner } = decodeToken(req);

  try {
    const postShare = await client.query(postShareQuery, [
      idPost,
      idOwner,
      date,
    ]);
    res.status(200).json({ idShare: postShare.rows[0].id, idOwner });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/edit", async (req, res) => {
  const { idPost, content } = req.body;

  try {
    await client.query(editPostQuery, [content, idPost]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { idPost } = req.body;

  try {
    await client.query(deletePostQuery, [idPost]);
    await client.query(deleteRepliesQuery, [idPost]);
    await client.query(deleteCommentsQuery, [idPost]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share/delete", async (req, res) => {
  const { idShare } = req.body;

  try {
    await client.query(deleteSharePostQuery, [idShare]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
