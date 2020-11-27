const express = require("express");
const path = require("path");
const fs = require("fs");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../decodeToken");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { postId, content } = req.body;

  if (!/^[0-9]*$/.test(postId) || !content)
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = await decodeToken(req.cookies.token, res);
  if (error) return res.status(401).json(error);

  const date = new Date();

  const addCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/comment.sql"))
    .toString();
  const getPostIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/postId.sql"))
    .toString();

  try {
    const { rows } = await client.query(getPostIdQuery, [postId]);
    if (!rows[0].id) return res.status(400).json("post-does-not-exist");
    const comment = await client.query(addCommentQuery, [
      postId,
      ownerId,
      content,
      date,
    ]);
    return res.status(200).json({
      commentId: comment.rows[0].id,
      date,
    });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { commentId } = req.body;

  if (!/^[0-9]*$/.test(commentId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = await decodeToken(req.cookies.token, res);
  if (error) return res.status(401).json(error);

  const deleteCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/comment.sql"))
    .toString();

  try {
    await client.query(deleteCommentQuery, [commentId, ownerId]);
    return res.status(200).json({
      success: true,
    });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from, postId } = req.body;

  if (!/^[0-9]*$/.test(postId) || !/^[0-9]*$/.test(from))
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = await decodeToken(req.cookies.token, res);
  if (error) return res.status(401).json(error);

  const getGroupPermissionQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupPermissionByPostId.sql")
    )
    .toString();

  const getCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/comments.sql"))
    .toString();

  let result;
  try {
    const { rows } = await client.query(getGroupPermissionQuery, [
      postId,
      ownerId,
    ]);
    if (rows[0].groupId && !rows[0].id)
      return res.status(403).json("no-permission");
    result = await client.query(getCommentsQuery, [postId, ownerId, from]);
  } catch {
    return res.status(400).json("bad-request");
  }

  let { rows: comments } = result;
  let isMore = true;
  if (comments.length != 21) {
    isMore = false;
  } else {
    comments = comments.slice(0, -1);
  }
  return res.status(200).json({
    comments,
    isMore,
  });
});

router.post("/like", async (req, res) => {
  const { commentId } = req.body;

  if (!/^[0-9]*$/.test(commentId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = await decodeToken(req.cookies.token, res);
  if (error) return res.status(401).json(error);

  const getGroupPermissionQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupPermissionByCommentId.sql")
    )
    .toString();
  const likeCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/like.sql"))
    .toString();
  const getLikeIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/likeId.sql"))
    .toString();

  try {
    const { rows } = await client.query(getGroupPermissionQuery, [
      commentId,
      ownerId,
    ]);

    if (rows[0].groupId && !rows[0].id)
      return res.status(403).json("no-permission");

    const { rows: newLike } = await client.query(likeCommentQuery, [
      commentId,
      ownerId,
    ]);

    let likeId;
    if (!newLike[0]) {
      const { rows } = await client.query(getLikeIdQuery, [commentId, ownerId]);
      likeId = rows[0].id;
    } else likeId = newLike[0].id;

    return res.status(200).json({ likeId });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { commentId } = req.body;

  if (!/^[0-9]*$/.test(commentId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = await decodeToken(req.cookies.token, res);
  if (error) return res.status(401).json(error);

  const getGroupPermissionQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupPermissionByCommentId.sql")
    )
    .toString();
  const unlikeCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/like.sql"))
    .toString();

  try {
    const { rows } = await client.query(getGroupPermissionQuery, [
      commentId,
      ownerId,
    ]);
    if (rows[0].groupId && !rows[0].id)
      return res.status(403).json("no-permission");

    await client.query(unlikeCommentQuery, [commentId, ownerId]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
