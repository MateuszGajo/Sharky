const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { idUser, idGroup } = req.body;

  const addUserQuery = `insert into group_users(id_group, id_user) values($1,$2)`;

  try {
    await client.query(addUserQuery, [idGroup, idUser]);

    res.status(200);
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
