const express = require("express");
const { client } = require("../../../config/pgAdaptor");

const router = express.Router();

router.get("/get", async (req, res) => {
  const getCountriesQuery = `select name from countries`;

  try {
    const { rows: countries } = await client.query(getCountriesQuery);

    res.status(200).json({ countries });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
