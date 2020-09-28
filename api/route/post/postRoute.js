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
  const { id: onwerId } = decodeToken(req);

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

    const { content, date, groupId, fanpageId, news } = req.body;
    let newPost;
    try {
      if (groupId)
        newPost = await client.query(addGroupPostQuery, [
          onwerId,
          groupId,
          content,
          date,
          fileName,
        ]);
      else if (fanpageId)
        newPost = await client.query(addFanpagePostQuery, [
          onwerId,
          fanpageId,
          content,
          date,
          fileName,
        ]);
      else if (news)
        newPost = await client.query(addNewsQuery, [
          onwerId,
          content,
          date,
          fileName,
        ]);
      else
        newPost = await client.query(addPostQuery, [
          onwerId,
          content,
          date,
          fileName,
        ]);
      return res.status(200).json({
        postId: newPost.rows[0].id,
        fileName,
      });
    } catch {
      return res.status(400).json("bad-request");
    }
  });
});

router.post("/get", async (req, res) => {
  const { from, fanpageId, groupId, news, userId, authorPost } = req.body;
  const { id: onwerId } = decodeToken(req);

  let postsResult, commentsResult;

  try {
    if (fanpageId)
      postsResult = await client.query(getFanpagePostsQuery, [
        fanpageId,
        onwerId,
        from,
      ]);
    else if (groupId)
      postsResult = await client.query(getGroupPostsQuery, [
        groupId,
        onwerId,
        from,
      ]);
    else if (authorPost)
      postsResult = await client.query(getUserPostQuery, [
        userId,
        onwerId,
        from,
      ]);
    else if (news)
      postsResult = await client.query(getNewsQuery, [onwerId, from]);
    else postsResult = await client.query(getPostsQuery, [onwerId, from]);

    const postIds = [];
    for (let i = 0; i < postsResult.rows.length; i++) {
      postIds.push(postsResult.rows[i].postId);
    }
    commentsResult = await client.query(getCommentsQuery, [postIds, onwerId]);
  } catch {
    res.status(400).json("bad-request");
  }

  let isMorePosts = true;

  let { rows: posts } = postsResult;
  let { rows: comments } = commentsResult;
  if (posts.length != 21) {
    isMorePosts = false;
  } else {
    posts = posts.slice(0, -1);
  }

  return res.status(200).json({
    posts,
    comments,
    isMorePosts,
  });
});

router.post("/get/single", async (req, res) => {
  const { postId } = req.body;

  const { id: onwerId } = decodeToken(req);

  try {
    const { rows: post } = await client.query(getPostQuery, [postId, onwerId]);
    if (!post[0]) return res.status(404).json("post-does-not-exist");

    if (post[0].fanpageId) {
      const { rows } = await client.query(doesUserBelongToFanpageQuery, [
        userId,
      ]);
      if (!rows[0])
        return res.status(403).json("user-does-not-have-permission");
    }

    if (post[0].groupId) {
      const { rows } = await client.query(doesUserBelongToGroupqQuery, [
        userId,
      ]);
      if (!rows[0])
        return res.status(403).json("user-does-not-have-permission");
    }

    let { rows: comments } = await client.query(getCommentsQuery, [
      [post[0].postId],
      onwerId,
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
  const { postId } = req.body;

  const { id: onwerId } = decodeToken(req);

  try {
    const { rows: newLike } = await client.query(postLikeQuery, [
      onwerId,
      postId,
    ]);

    let likeId;

    if (!newLike[0]) {
      const { rows } = await client.query(getIdPostQuery, [onwerId, postId]);
      likeId = rows[0].id;
    } else likeId = newLike[0].id;

    res.status(200).json({ likeId });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { likeId } = req.body;

  try {
    await client.query(unLikeQuery, [likeId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share", async (req, res) => {
  const { postId, date } = req.body;
  const { id: onwerId } = decodeToken(req);

  try {
    const postShare = await client.query(postShareQuery, [
      postId,
      onwerId,
      date,
    ]);
    res.status(200).json({ shareId: postShare.rows[0].id, userId: onwerId });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/edit", async (req, res) => {
  const { postId, content } = req.body;

  try {
    await client.query(editPostQuery, [content, postId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { postId } = req.body;

  try {
    await client.query(deletePostQuery, [postId]);
    await client.query(deleteRepliesQuery, [postId]);
    await client.query(deleteCommentsQuery, [postId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share/delete", async (req, res) => {
  const { shareId } = req.body;

  try {
    await client.query(deleteSharePostQuery, [shareId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
