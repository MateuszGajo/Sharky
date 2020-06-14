const express = require("express");
const router = express.Router();
const { client } = require("../../../config/pgAdaptor");

router.post("/get", async (req, res) => {
  const { usersId } = req.body;
  const usersIdParm = usersId.join(",");
  console.log(usersIdParm);
  const getUserQuery = `select * from users where id in($1);`;

  try {
    const users = await client.query(getUserQuery, [usersIdParm]);
    console.log(users);
  } catch {
    console.log("hjuston problemo");
    return res.status(400);
  }
});

module.exports = router;
