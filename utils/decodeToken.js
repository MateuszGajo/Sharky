const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

module.exports = (req) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const { data } = jwt.verify(token, jwtSecret);
      return data;
    } catch {
      return {
        error: "invalid token",
      };
    }
  }
  return {};
};
