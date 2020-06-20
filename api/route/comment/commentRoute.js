const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idPost, content } = req.body;
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        idUser: "1",
        firstName: "Janek",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { idUser, firstName, lastName, photo } = decoded.data;

  const addCommentQuery = `
    INSERT INTO post_comments(id_post, id_user, content) values($1,$2,$3) RETURNING id;
    `;
  try {
    const comment = await client.query(addCommentQuery, [
      idPost,
      idUser,
      content,
    ]);
    res.status(200).json({
      user: {
        id: idUser,
        firstName,
        lastName,
        photo,
      },
      idPost: comment.rows[0].id,
    });
  } catch {
    console.log("catch");
    res.status(400);
  }
});

module.exports = router;
