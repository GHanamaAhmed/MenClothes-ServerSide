const jwt = require("jsonwebtoken");
const veriifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(" ")[1]) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) req.sendStatus(401);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
