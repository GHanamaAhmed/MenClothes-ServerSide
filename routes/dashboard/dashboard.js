const router = require("express").Router();
const dashboard = require("../../controller/dashboardController");
router.route("/").get(dashboard.statictique);
module.exports=router