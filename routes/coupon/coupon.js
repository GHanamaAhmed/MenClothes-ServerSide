const router = require("express").Router();
const coupon = require("../../controller/couponController");
router.route("/").post(coupon.checkout);
module.exports = router;
