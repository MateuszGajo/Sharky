const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { jwtSecret } = require("../../config/keys");
const { client } = require("../../config/pgAdaptor");

module.exports = async (token, res) => {
  const getPasswordQuery = fs
    .readFileSync(path.join(__dirname, "./user/query/get/password.sql"))
    .toString();
  const getThirdIdQuery = fs
    .readFileSync(path.join(__dirname, "./user/query/get/thirdId.sql"))
    .toString();

  if (!token) return { error: "no-token-provided" };
  try {
    const { data } = jwt.verify(token, jwtSecret);
    const { rowCount } = await client.query(getThirdIdQuery, [data.id]);
    if (rowCount === 0) {
      const { rows } = await client.query(getPasswordQuery, [data.id]);
      if (data.password !== rows[0].password)
        return { error: "password-changed" };
    }
    return data;
  } catch {
    return { error: "invalid-token" };
  }
};
