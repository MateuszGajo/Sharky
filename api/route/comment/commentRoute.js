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
  const { idPost, content, date } = req.body;
  const { id: idOwner } = decodeToken(req);

  try {
    const comment = await client.query(addCommentQuery, [
      idPost,
      idOwner,
      content,
      date,
    ]);
    return res.status(200).json({
      idComment: comment.rows[0].id,
    });
  } catch {
    return res.status(400).json("bad-request");
  }
});

router.post("/get", async (req, res) => {
  const { from, idPost } = req.body;

  const { id: idOwner } = decodeToken(req);

  let result;
  try {
    result = await client.query(commentsQuery, [idPost, idOwner, from]);
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
  const { idComment } = req.body;

  const { id: idOwner } = decodeToken(req);

  try {
    const { rows: newLike } = await client.query(likeCommentQuery, [
      idComment,
      idOwner,
    ]);

    let idLike;
    if (!newLike[0]) {
      const { rows } = await client.query(getIdLikeQuery, [idComment, idOwner]);

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
    await client.query(unlikeCommentQuery, [idLike]);

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
