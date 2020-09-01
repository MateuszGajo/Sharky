const express = require("express");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const { groupInvitationQuery, changeRelationRequestQuery } = require("./query");
const router = express.Router();

router.get("/get", async (req, res) => {
  const { id: idOwner } = decodeToken(req);

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
