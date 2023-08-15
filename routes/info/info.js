const router = require("express").Router();
const info = require("../../controller/infoController");
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
router.route("/").get(info.getInfo).post(authMiddleware, isAdmin, info.change);
module.exports = router;
