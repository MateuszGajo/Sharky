const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const { checkPermission } = require("./query");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.get("/permission", async (req, res) => {
  const { id: ownerId } = decodeToken(req);

  try {
    const { rows } = await client.query(checkPermission, [ownerId]);
    if (!rows[0]) return res.status(200).json({ permission: false });

    res.status(200).json({ permission: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
