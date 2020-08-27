const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../../../config/pgAdaptor");
const { jwtSecret } = require("../../../config/keys");
const { groupInvitationQuery, changeRelationRequestQuery } = require("./query");
const router = express.Router();

router.get("/get", async (req, res) => {
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
    const { rows: invitations } = await client.query(groupInvitationQuery, [
      idOwner,
    ]);
    const {
      rows: newRelations,
    } = await client.query(changeRelationRequestQuery, [idOwner]);
    res.status(200).json({ invitations, newRelations });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
