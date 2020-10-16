const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

module.exports = (token) => {
  if (!token) return { error: "no-token-provided" };
  try {
    const { data } = jwt.verify(token, jwtSecret);
    return data;
  } catch {
    return { error: "invalid-token" };
  }
};
