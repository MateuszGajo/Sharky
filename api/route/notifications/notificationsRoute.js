const express = require("express");
const fs = require("fs");
const path = require("path");
const { client } = require("../../../config/pgAdaptor");
const decodeToken = require("../decodeToken");

const router = express.Router();

router.get("/get", async (req, res) => {
  const { error, id: ownerId } = await decodeToken(req.cookies.token);
  if (error) return res.status(401).json(error);

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
    return res.status(200).json({ invitations, newRelations });
  } catch {
    return res.status(400).json("bad-request");
  }
});

module.exports = router;
