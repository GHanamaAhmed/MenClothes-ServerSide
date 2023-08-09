const { authMiddleware } = require("../../middlewares/middlewareAuth");
const { auth, logOut } = require("../../controller/authController");
const router = require("express").Router();

router.head("/", authMiddleware, auth);
router.get("/", authMiddleware, logOut);

module.exports = router;
