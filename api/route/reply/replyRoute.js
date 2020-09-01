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
  const { idComment, content, date } = req.body;

  const { id: idOwner } = decodeToken(req);

  try {
    const reply = await client.query(addReplyQuery, [
      idComment,
      idOwner,
      content,
      date,
    ]);

    return res.status(200).json({ idReply: reply.rows[0].id });
  } catch {
    return res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { idComment, from } = req.body;

  const { id: idOwner } = decodeToken(req);

  let result;

  try {
    result = await client.query(replyQuery, [idComment, idOwner, from]);
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
  const { idReply } = req.body;

  const { id: idOwner } = decodeToken(req);

  try {
    const { rows: newLike } = await client.query(likeReplyQuery, [
      idReply,
      idOwner,
    ]);

    let idLike;
    if (!newLike[0]) {
      const { rows } = await client.query(getIdLike, [idReply, idOwner]);

      idLike = rows[0].id;
    } else idLike = newLike[0].id;

    return res.status(200).json({ idLike });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { idLike } = req.body;

  try {
    await client.query(unlikeReplyQuery, [idLike]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
