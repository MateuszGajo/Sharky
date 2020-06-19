const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idComment, content } = req.body;

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        idUser: "1",
      },
    },
    jwtSecret
  );
  const decoded = jwt.verify(token, jwtSecret);

  const { idUser } = decoded.data;

  const addReplyQuery = `
      INSERT INTO comment_replies(id_comment, id_user, content) values($1,$2,$3);
      `;
  try {
    await client.query(addReplyQuery, [idComment, idUser, content]);
    res.status(200);
  } catch {
    res.status(400);
  }
});

module.exports = router;
