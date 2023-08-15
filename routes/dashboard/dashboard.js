const router = require("express").Router();
const dashboard = require("../../controller/dashboardController");
const { isAdmin, authMiddleware } = require("../../middlewares/middlewareAuth");
router.route("/").get(authMiddleware,isAdmin,dashboard.statictique);
module.exports=router