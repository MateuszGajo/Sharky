const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../decodeToken");
const router = express.Router();

router.get("/permission", async (req, res) => {
  const { error, id: ownerId } = await decodeToken(req.cookies.token, res);
  if (error) return res.status(401).json(error);

  const getJournalistIdQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/journalistId.sql"))
    .toString();

  try {
    const { rows } = await client.query(getJournalistIdQuery, [ownerId]);
    if (!rows[0]) return res.status(200).json({ permission: false });

    res.status(200).json({ permission: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
