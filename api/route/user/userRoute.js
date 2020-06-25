const express = require("express");
const router = express.Router();
const { client } = require("../../../config/pgAdaptor");

router.post("/get", async (req, res) => {
  const { idUsers } = req.body;

  const getUserQuery = `select id, first_name as "firstName", last_name as "lastName", photo from users where id = ANY($1);`;

  try {
    const { rows: users } = await client.query(getUserQuery, [idUsers]);

    return res.status(200).json({ users });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
