const passport = require("passport");
const router = require("express").Router();

router.get(
  "/facebook",
  (req, res, next) => {
    req.session.role = req?.query?.role;
    next();
  },
  passport.authenticate("facebook", {
    scope: ["user_friends", "manage_pages"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: true,
    keepSessionInfo: true,
  }),
  (req, res) => {
    if (req.session?.role == "admin") {
      return res.redirect(process.env.ADMIN_URL);
    } else {
      return res.redirect(process.env.CLIENT_URL);
    }
  }
);
module.exports = router;
