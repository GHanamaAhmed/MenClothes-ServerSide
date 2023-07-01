const jwt = require("jsonwebtoken");
const createAccessToken = ({ id, role }) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET);
};
const createRefreshToken = ({ id, role }) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET);
};
module.exports.Signup = (req, res) => {};
