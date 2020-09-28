const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const {
  addReplyQuery,
  replyQuery,
  likeReplyQuery,
  unlikeReplyQuery,
  getIdLike,
} = require("./query");
const decodeToken = require("../../../utils/decodeToken");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { commnetId, content, date } = req.body;

  const { id: onwerId } = decodeToken(req);

  try {
    const reply = await client.query(addReplyQuery, [
      commnetId,
      onwerId,
      content,
      date,
    ]);

    return res.status(200).json({ replyId: reply.rows[0].id });
  } catch {
    return res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { commnetId, from } = req.body;

  const { id: onwerId } = decodeToken(req);

  let result;

  try {
    result = await client.query(replyQuery, [commnetId, onwerId, from]);
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

  const { id: onwerId } = decodeToken(req);

  try {
    const { rows: newLike } = await client.query(likeReplyQuery, [
      replyId,
      onwerId,
    ]);

    let likeId;
    if (!newLike[0]) {
      const { rows } = await client.query(getIdLike, [replyId, onwerId]);

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
    await client.query(unlikeReplyQuery, [likeId]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
