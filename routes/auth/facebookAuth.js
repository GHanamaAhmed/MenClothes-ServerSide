const passport = require("passport");
const router = require("express").Router();

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["user_friends", "manage_pages"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000",
  })
);
module.exports = router;
