const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const { ClientBase } = require("pg");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/static/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        return cb(new Error("wrong file type"));
      }
      cb(null, true);
    },
    limits: { fileSize: 200000 },
  }).single("file");
  await upload(req, res, async (err) => {
    if (err) {
      return err.message == "File too large"
        ? res.status(413).json("file-too-large")
        : err.message === "wrong file type"
        ? res.status(415).json("wrong-file-type")
        : res.status(400).json("bad-request");
    }

    let fileName = null;
    if (req.file) {
      fileName = req.file.filename;
    }

    const { content, groupId, fanpageId, news } = JSON.parse(req.body.data);
    const date = new Date();

    if (
      typeof content !== "string" ||
      !(groupId == null || /^[\d]*$/.test(groupId)) ||
      !(fanpageId == null || /^[\d]*$/.test(fanpageId)) ||
      typeof news !== "boolean"
    )
      return res.status(400).json("invalid-data");

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
    const getMemberQuery = fs
      .readFileSync(path.join(__dirname, "./query/get/member.sql"))
      .toString();
    const getFanpageAdminQuery = fs
      .readFileSync(path.join(__dirname, "./query/get/fanpageAdmin.sql"))
      .toString();
    const getJournalistQuery = fs
      .readFileSync(path.join(__dirname, "./query/get/journalist.sql"))
      .toString();
    let newPost;
    try {
      if (groupId) {
        const { rows } = await client.query(getMemberQuery, [ownerId, groupId]);
        if (!rows[0].id) return res.status(403).json("no-permission");
        newPost = await client.query(addGroupPostQuery, [
          ownerId,
          groupId,
          content,
          date,
          fileName,
        ]);
      } else if (fanpageId) {
        const { rows } = await client.query(getFanpageAdminQuery, [
          ownerId,
          fanpageId,
        ]);
        if (!rows[0].id) return res.status(403).json("no-permission");
        newPost = await client.query(addFanpagePostQuery, [
          ownerId,
          fanpageId,
          content,
          date,
          fileName,
        ]);
      } else if (news) {
        const { rows } = await client.query(getJournalistQuery, [ownerId]);
        if (!rows[0].id) return res.status(403).json("no-permission");
        newPost = await client.query(addNewsQuery, [
          ownerId,
          content,
          date,
          fileName,
        ]);
      } else
        newPost = await client.query(addPostQuery, [
          ownerId,
          content,
          date,
          fileName,
        ]);

      return res.status(200).json({
        postId: newPost.rows[0].id,
        fileName,
        date,
      });
    } catch {
      return res.status(400).json("bad-request");
    }
  });
});

router.post("/get", async (req, res) => {
  const { from, fanpageId, groupId, news, userId, authorPost } = req.body;
  if (
    !(groupId == null || /^[\d]*$/.test(groupId)) ||
    !(userId == null || /^[\d]*$/.test(userId)) ||
    !(fanpageId == null || /^[\d]*$/.test(fanpageId)) ||
    typeof news !== "boolean" ||
    typeof authorPost !== "boolean" ||
    !/^[\d]*$/.test(from)
  ) {
    return res.status(400).json("invalid-data");
  }

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

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
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();
  let postsResult, commentsResult;

  try {
    if (fanpageId)
      postsResult = await client.query(getFanpagePostsQuery, [
        fanpageId,
        ownerId,
        from,
      ]);
    else if (groupId) {
      const { rows } = await client.query(getMemberQuery, [ownerId, groupId]);
      if (!rows[0].id) return res.status(403).json("no-permission");
      postsResult = await client.query(getGroupPostsQuery, [
        groupId,
        ownerId,
        from,
      ]);
    } else if (authorPost)
      postsResult = await client.query(getUserPostsQuery, [
        userId,
        ownerId,
        from,
      ]);
    else if (news)
      postsResult = await client.query(getNewsQuery, [ownerId, from]);
    else postsResult = await client.query(getPostsQuery, [ownerId, from]);

    const postIds = [];
    for (let i = 0; i < postsResult.rows.length; i++) {
      postIds.push(postsResult.rows[i].postId);
    }
    commentsResult = await client.query(getCommentsQuery, [postIds, ownerId]);
  } catch {
    return res.status(400).json("bad-request");
  }

  let isMorePosts = true;

  let { rows: posts } = postsResult;
  let { rows: comments } = commentsResult;
  if (posts.length != 21) {
    isMorePosts = false;
  } else {
    posts = posts.slice(0, -1);
  }

  return res.status(200).send({
    posts,
    comments,
    isMorePosts,
  });
});

router.post("/get/single", async (req, res) => {
  const { postId } = req.body;
  if (!/^[\d]*$/.test(postId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/post.sql"))
    .toString();
  const getMemberIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();
  const getCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/comments.sql"))
    .toString();

  try {
    const { rows: post } = await client.query(getPostQuery, [postId, ownerId]);
    if (!post[0]) return res.status(404).json("post-does-not-exist");

    if (post[0].groupId) {
      const { rows } = await client.query(getMemberIdQuery, [
        ownerId,
        post[0].groupId,
      ]);
      if (!rows[0])
        return res.status(403).json("user-does-not-have-permission");
    }

    let { rows: comments } = await client.query(getCommentsQuery, [
      [post[0].postId],
      ownerId,
    ]);

    let isMoreComments = true;

    if (comments.length < 3) {
      isMoreComments = false;
    } else {
      comments = comments.slice(0, -1);
    }

    res.status(200).json({ post: post[0], comments, isMoreComments });
  } catch {
    console.log("catch");
    res.status(400).json("bad-request");
  }
});

router.post("/like", async (req, res) => {
  const { postId } = req.body;
  if (!/^[\d]*$/.test(postId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const likePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/like.sql"))
    .toString();
  const getPostIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/postId.sql"))
    .toString();
  const getGroupIdInPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupIdInPost.sql"))
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows: groupId } = await client.query(getGroupIdInPostQuery, [
      postId,
    ]);
    if (groupId[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        groupId[0].groupId,
      ]);
      if (!rows[0]) return res.status(403).json("no-permission");
    }
    const { rows: newLike } = await client.query(likePostQuery, [
      ownerId,
      postId,
    ]);

    let likeId;

    if (!newLike[0]) {
      const { rows } = await client.query(getPostIdQuery, [ownerId, postId]);
      likeId = rows[0].id;
    } else likeId = newLike[0].id;

    res.status(200).json({ likeId });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { postId } = req.body;
  if (!/^[\d]*$/.test(postId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const unlikePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/like.sql"))
    .toString();
  const getGroupIdInPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupIdInPost.sql"))
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows: groupId } = await client.query(getGroupIdInPostQuery, [
      postId,
    ]);
    if (groupId[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        groupId[0].groupId,
      ]);
      if (!rows[0]) return res.status(403).json("no-permission");
    }
    await client.query(unlikePostQuery, [postId, ownerId]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share", async (req, res) => {
  const { postId } = req.body;
  const date = new Date();
  if (!/^[\d]*$/.test(postId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const postShareQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/sharePost.sql"))
    .toString();
  const getGroupIdInPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupIdInPost.sql"))
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows: groupId } = await client.query(getGroupIdInPostQuery, [
      postId,
    ]);
    if (groupId[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        groupId[0],
      ]);
      if (!rows[0].groupId) return res.status(403).json("no-permission");
    }
    const postShare = await client.query(postShareQuery, [
      postId,
      ownerId,
      date,
    ]);
    res
      .status(200)
      .json({ shareId: postShare.rows[0].id, userId: ownerId, date });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/edit", async (req, res) => {
  const { postId, content } = req.body;
  if (!/^[\d]*$/.test(postId) || typeof content !== "string")
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const updatePostContentQuery = fs
    .readFileSync(path.join(__dirname, "./query/update/postContent.sql"))
    .toString();
  const getGroupIdInPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupIdInPost.sql"))
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows: groupId } = await client.query(getGroupIdInPostQuery, [
      postId,
    ]);
    if (groupId[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        groupId[0].groupId,
      ]);
      if (!rows[0]) return res.status(403).json("no-permission");
    }
    await client.query(updatePostContentQuery, [content, postId, ownerId]);

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { postId } = req.body;
  if (!/^[\d]*$/.test(postId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deletePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/post.sql"))
    .toString();
  const deleteRepliesQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/replies.sql"))
    .toString();
  const deleteCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/comments.sql"))
    .toString();
  const getGroupIdInPostQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupIdInPost.sql"))
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows: groupId } = await client.query(getGroupIdInPostQuery, [
      postId,
    ]);
    if (groupId[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        groupId[0].groupId,
      ]);
      if (!rows[0]) return res.status(403).json("no-permission");
    }
    const { rows: post } = await client.query(deletePostQuery, [
      postId,
      ownerId,
    ]);
    if (post[0].id) {
      await client.query(deleteRepliesQuery, [postId]);
      await client.query(deleteCommentsQuery, [postId]);
    } else return res.status(403).json("no-permission");
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/share/delete", async (req, res) => {
  const { shareId } = req.body;
  if (!/^[\d]*$/.test(shareId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteSharePostQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/postShared.sql"))
    .toString();

  try {
    const { rows: post } = await client.query(deleteSharePostQuery, [
      shareId,
      ownerId,
    ]);
    if (!post[0].id) return res.status(403).json("no-permission");

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
