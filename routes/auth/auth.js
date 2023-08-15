const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const { auth, logOut } = require("../../controller/authController");
const router = require("express").Router();

router.head("/client", authMiddleware, auth);
router.get("/admin", authMiddleware, isAdmin, auth);
router.get("/", authMiddleware, logOut);
module.exports = router;
