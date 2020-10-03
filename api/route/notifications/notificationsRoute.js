const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../../../utils/decodeToken");
const router = express.Router();

router.get("/get", async (req, res) => {
  const { id: ownerId } = decodeToken(req);

  const getGroupInvitationQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/groupInvitations.sql"))
    .toString();
  const getNewRelationQuery = fs
    .readFileSync(path.join(__dirname, "./query/get/newRelations.sql"))
    .toString();

  try {
    const { rows: invitations } = await client.query(getGroupInvitationQuery, [
      ownerId,
    ]);
    const { rows: newRelations } = await client.query(getNewRelationQuery, [
      ownerId,
    ]);
    res.status(200).json({ invitations, newRelations });
  } catch {
    res.status(400).json("bad-request");
  }
});

module.exports = router;
