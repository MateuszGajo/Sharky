const express = require("express");
const { client } = require("../../../config/pgAdaptor");

const router = express.Router();

router.get("/get", async (req, res) => {
  const getLanguagesQuery = `select name from languages`;

  try {
    const { rows: languages } = await client.query(getLanguagesQuery);

    res.status(200).json({ languages });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
