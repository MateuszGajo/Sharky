const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { commentId, content } = req.body;
  const date = new Date();
  if (!/^[\d]*$/.test(commentId) || typeof content !== "string")
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const addReplyQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/reply.sql"))
    .toString();
  const getGroupIdInPostsQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupIdInPostsByCommentId.sql")
    )
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows: result } = await client.query(getGroupIdInPostsQuery, [
      commentId,
    ]);
    if (!result[0].postId)
      return res.status(400).json("comment-does-not-exist");
    if (result[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        result[0].groupId,
      ]);
      if (!rows[0].id) return res.status(403).json("no-permission");
    }
    const reply = await client.query(addReplyQuery, [
      commentId,
      ownerId,
      content,
      date,
    ]);

    return res.status(200).json({ replyId: reply.rows[0].id, date });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/delete", async (req, res) => {
  const { replyId } = req.body;
  if (!/^[\d]*$/.test(replyId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const deleteReplyQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/reply.sql"))
    .toString();

  try {
    await client.query(deleteReplyQuery, [replyId, ownerId]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { commentId, from } = req.body;
  if (!/^[\d]*$/.test(commentId) || !/^[\d]*$/.test(from))
    return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const getRepliesQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/replies.sql"))
    .toString();
  const getGroupIdInPostsQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupIdInPostsByCommentId.sql")
    )
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();
  let result;

  try {
    const { rows: ids } = await client.query(getGroupIdInPostsQuery, [
      commentId,
    ]);
    if (!ids[0].postId) return res.status(400).json("comment-does-not-exist");
    if (ids[0].groupId) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        ids[0].groupId,
      ]);
      if (!rows[0].id) return res.status(403).json("no-permission");
    }
    result = await client.query(getRepliesQuery, [commentId, ownerId, from]);
  } catch {
    return res.status(400).json("bad-request");
  }
  let { rows: replies } = result;
  let isMore = true;

  if (replies.length != 21) {
    isMore = false;
  } else {
    replies = replies.slice(0, -1);
  }

  return res.status(200).json({
    replies,
    isMore,
  });
});

router.post("/like", async (req, res) => {
  const { replyId } = req.body;
  if (!/^[\d]*$/.test(replyId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const likeReplyQuery = fs
    .readFileSync(path.join(__dirname, "./query/add/like.sql"))
    .toString();
  const getGroupIdInPostsQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupIdInPostsByReplyId.sql")
    )
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows } = await client.query(getGroupIdInPostsQuery, [replyId]);
    if (rows[0].idGroup) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        rows[0].idGroup,
      ]);
      if (!rows[0].id) return res.status(403).json("no-permission");
    }
    const { rows: newLike } = await client.query(likeReplyQuery, [
      replyId,
      ownerId,
    ]);

    return res.status(200).json({ likeId: newLike[0].id });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { replyId } = req.body;
  if (!/^[\d]*$/.test(replyId)) return res.status(400).json("invalid-data");

  const { error, id: ownerId } = decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

  const unlikeReplyQuery = fs
    .readFileSync(path.join(__dirname, "./query/delete/like.sql"))
    .toString();
  const getGroupIdInPostsQuery = fs
    .readFileSync(
      path.join(__dirname, "./query/get/groupIdInPostsByReplyId.sql")
    )
    .toString();
  const getMemberQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/member.sql"))
    .toString();

  try {
    const { rows } = await client.query(getGroupIdInPostsQuery, [replyId]);

    if (rows[0].idGroup) {
      const { rows } = await client.query(getMemberQuery, [
        ownerId,
        rows[0].idGroup,
      ]);

      if (!rows[0].id) return res.status(403).json("no-permission");
    }
    await client.query(unlikeReplyQuery, [replyId, ownerId]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
