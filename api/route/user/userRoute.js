const express = require("express");
const router = express.Router();
const { client } = require("../../../config/pgAdaptor");

router.post("/get", async (req, res) => {
  const { usersId } = req.body;

  const getUserQuery = `select id, first_name, last_name, photo from users where id = ANY($1);`

  try {
    const users = await client.query(getUserQuery, [usersId]);
    const usersKey = {};
    const { rowCount, rows } = users;
    for (let i = 0; i < rowCount; i++) {
      const { id, first_name: firstName, last_name: lastName, photo } = rows[i]
      usersKey[id] = {
        id,
        firstName,
        lastName,
        photo
      }
    }
    return res.json(usersKey);
  } catch {
    return res.status(400);
  }
});

module.exports = router;
