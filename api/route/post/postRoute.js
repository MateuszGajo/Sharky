const express = require("express");
const jwt = require("jsonwebtoken");
const { clinet, client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { content, date, photo } = req.body;
  // const token = req.cookies.token || null;
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

module.exports = router;
