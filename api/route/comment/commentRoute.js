const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const {
  commentsQuery,
  addCommentQuery,
  likeCommentQuery,
  unlikeCommentQuery,
  getIdLikeQuery,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { postId, content, date } = req.body;
  const { id: onwerId } = decodeToken(req);

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

  let result;
  try {
    result = await client.query(commentsQuery, [postId, onwerId, from]);
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

  try {
    const { rows: newLike } = await client.query(likeCommentQuery, [
      commnetId,
      onwerId,
    ]);

    let likeId;
    if (!newLike[0]) {
      const { rows } = await client.query(getIdLikeQuery, [commnetId, onwerId]);

      likeId = rows[0].id;
    } else likeId = newLike[0].id;
    return res.status(200).json({ likeId });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { likeId } = req.body;

  try {
    await client.query(unlikeCommentQuery, [likeId]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
