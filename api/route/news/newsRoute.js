const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const { checkPermission } = require("./query");
const router = express.Router();

router.get("/permission", async (req, res) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        id: 1,
      },
    },
    jwtSecret
  );
  const {
    data: { id: idOwner },
  } = jwt.verify(token, jwtSecret);

  try {
    const { rows } = await client.query(checkPermission, [idOwner]);
    if (!rows[0]) return res.status(200).json({ permission: false });

    res.status(200).json({ permission: true });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
