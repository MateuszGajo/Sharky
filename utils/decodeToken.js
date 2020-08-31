const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

module.exports = (req) => {
  const token = req.cookies.token;
  const { data } = jwt.verify(token, jwtSecret);
  return data;
};
