const express = require("express");
const jwt = require("jsonwebtoken");
const { clinet, client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const { route } = require("next/dist/next-server/server/router");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { content, date, photo } = req.body;
  // const token = req.cookies.token || null;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        userId: "3",
        firstName: "Janek",
        lastName: "Kowalski",
        userPhoto: "profile.png",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { userId, firstName, lastName, userPhoto } = decoded.data;

  const addPostQuery =
    "insert into posts(id_user, content, date, photo) values($1, $2, $3, $4) RETURNING id";
  try {
    const newPost = await client.query(addPostQuery, [
      userId,
      content,
      date,
      photo,
    ]);

    if (newPost.rowCount == 0) {
      return res.status(400);
    }

    return res.json({
      success: true,
      user: { id: userId, firstName, lastName, photo: userPhoto },
      postId: newPost.rows[0].id,
    });
  } catch {
    return res.status(400);
  }
});

router.post("/get", async (req, res) => {
  const { from } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        userId: "1",
        firstName: "Janek",
        lastName: "Kowalski",
        userPhoto: "profile.png",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { userId } = decoded.data;

  try {
    const getPostsQuery = `select * from posts where id_user in(
    SELECT id_user_1  fROM friends where id_user_2=$1
    UNION
    SELECT id_user_2 fROM friends where id_user_1=$2)
    limit 20 OFFSET $3;`;

    const posts = await client.query(getPostsQuery, [userId, userId, from]);

    return res.json(posts.rows);
  } catch {
    console.log("bład");
    return res.status(400);
  }
});

module.exports = router;
