const passport = require("passport");
const router = require("express").Router();
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000",
  })
);
module.exports = router;
