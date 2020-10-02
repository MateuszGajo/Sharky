const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
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

    const addGroupPostQuery = fs
      .readFileSync(path.join(__dirname, "./query/add/groupPost.sql"))
      .toString();
    const addFanpagePostQuery = fs
      .readFileSync(path.join(__dirname, "./query/add/fanpagePost.sql"))
      .toString();
    const addNewsQuery = fs
      .readFileSync(path.join(__dirname, "./query/add/news.sql"))
      .toString();
    const addPostQuery = fs
      .readFileSync(path.join(__dirname, "./query/add/post.sql"))
      .toString();
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

  const getFanpagePostsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/fanpagePosts.sql"))
    .toString();
  const getGroupPostsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupPosts.sql"))
    .toString();
  const getUserPostsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/userPosts.sql"))
    .toString();
  const getNewsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/news.sql"))
    .toString();
  const getPostsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/posts.sql"))
    .toString();
  const getCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/comments.sql"))
    .toString();
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
      postsResult = await client.query(getUserPostsQuery, [
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

  const getPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/post.sql"))
    .toString();
  const getFanpageMemberIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/fanpageMemberId.sql"))
    .toString();
  const getGroupMemberIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupMemberId.sql"))
    .toString();
  const getCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/comments.sql"))
    .toString();

  try {
    const { rows: post } = await client.query(getPostQuery, [postId, onwerId]);
    if (!post[0]) return res.status(404).json("post-does-not-exist");

    if (post[0].fanpageId) {
      const { rows } = await client.query(getFanpageMemberIdQuery, [userId]);
      if (!rows[0])
        return res.status(403).json("user-does-not-have-permission");
    }

    if (post[0].groupId) {
      const { rows } = await client.query(getGroupMemberIdQuery, [userId]);
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

  const likePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/like.sql"))
    .toString();
  const getPostIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/postId.sql"))
    .toString();

  try {
    const { rows: newLike } = await client.query(likePostQuery, [
      onwerId,
      postId,
    ]);
    let likeId;

    if (!newLike[0]) {
      const { rows } = await client.query(getPostIdQuery, [onwerId, postId]);
      likeId = rows[0].id;
    } else likeId = newLike[0].id;

    res.status(200).json({ likeId });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { likeId } = req.body;

  const unlikePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/like"))
    .toString();

  try {
    await client.query(unlikePostQuery, [likeId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share", async (req, res) => {
  const { postId, date } = req.body;
  const { id: onwerId } = decodeToken(req);

  const postShareQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/sharePost.sql"))
    .toString();

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

  const updatePostContentQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/postContent.sql"))
    .toString();

  try {
    await client.query(updatePostContentQuery, [content, postId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { postId } = req.body;

  const deletePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/post.sql"))
    .toString();
  const deleteRepliesQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/replies.sql"))
    .toString();
  const deleteCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/comments.sql"))
    .toString();

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

  const deleteSharePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/postShared.sql"))
    .toString();

  try {
    await client.query(deleteSharePostQuery, [shareId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
