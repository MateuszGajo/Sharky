const express = require("express");
const path = require("path");
const fs = require("fs");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { postId, content, date } = req.body;
  const { id: onwerId } = decodeToken(req);

  const addCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/comment.sql"))
    .toString();

  try {
    const comment = await client.query(addCommentQuery, [
      postId,
      onwerId,
      content,
      date,
    ]);
    return res.status(200).json({
      commnetId: comment.rows[0].id,
    });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from, postId } = req.body;
  const { id: onwerId } = decodeToken(req);

  const getCommentsQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/comments/sql"))
    .toString();

  let result;
  try {
    result = await client.query(getCommentsQuery, [postId, onwerId, from]);
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
  const { commnetId } = req.body;
  const { id: onwerId } = decodeToken(req);

  const likeCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/like.sql"))
    .toString();

  const getLikeIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/likeId.sql"))
    .toString();

  try {
    const { rows: newLike } = await client.query(likeCommentQuery, [
      commnetId,
      onwerId,
    ]);

    let likeId;
    if (!newLike[0]) {
      const { rows } = await client.query(getLikeIdQuery, [commnetId, onwerId]);

      likeId = rows[0].id;
    } else likeId = newLike[0].id;
    return res.status(200).json({ likeId });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { likeId } = req.body;

  const unlikeCommentQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/like.sql"))
    .toString();

  try {
    await client.query(unlikeCommentQuery, [likeId]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
