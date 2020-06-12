const express = require("express");
const { clinet, client } = require("../../../config/pgAdaptor");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { content, userId, date, photo } = req.body;

  const addPostQuery =
    "insert into posts(id_user, content, date, photo) values($1, $2, $3, $4)";
  try {
    const newPost = await client.query(addPostQuery, [
      userId,
      content,
      date,
      photo,
    ]);

    if (newPost.rowCount == 0) {
      return res.json({ error: "add-post-error" });
    }

    return res.json({ success: true });
  } catch {
    return res.json({ error: "connect-db-error" });
  }
});

module.exports = router;
