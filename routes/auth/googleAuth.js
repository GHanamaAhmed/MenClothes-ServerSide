const passport = require("passport");
const router = require("express").Router();
router.get(
  "/google",
  (req, res, next) => {
    req.session.role = req?.query?.role;
    next();
  },
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
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
// router.get("/success", function (request, response) {
//   console.log(request.session);
//   response.redirect(request.session.lastUrl || "/");
// });
module.exports = router;
