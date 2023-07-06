const UserModel = require("../models/userModel");
const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("you did't authenticated!");
};
const isAdmin = (req, res, next) => {
  const user = req.user;
  const ifAdmin = user?.role == "admin";
  if (!ifAdmin) return res.status(401).send("you are not admin!");
  next();
};
module.exports = { authMiddleware, isAdmin };
