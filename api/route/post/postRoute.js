const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/like", async (req, res) => {
  const { idPost } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: "1",
        firstName: "Janek",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    jwtSecret
  );
  const {
    data: { id },
  } = jwt.verify(token, jwtSecret);

  try {
    const postLikeQuery = `INSERT INTO post_like(id_user, id_post) VALUES($1,$2) returning id`;
    const postLike = await client.query(postLikeQuery, [id, idPost]);
    res.status(200).json({ idPostLike: postLike.rows[0].id });
  } catch {
    res.status(400).json("bad-request");
  }
});

router.post("/unlike", async (req, res) => {
  const { idLike } = req.body;

  try {
    const unLikeQuery = `delete from post_like where id=$1`;
    await client.query(unLikeQuery, [idLike]);
    res.status(200).json({ success: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
