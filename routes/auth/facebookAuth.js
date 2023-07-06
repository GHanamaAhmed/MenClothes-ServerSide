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
    successRedirect: "http://158.180.30.34",
    failureRedirect: "http://localhost:5173/signin",
  })
);
module.exports = router;
