const { authMiddleware } = require("../../middlewares/middlewareAuth");
const { auth } = require("../../controller/authController");
const router = require("express").Router();

router.head("/", authMiddleware,auth);

module.exports = router;
