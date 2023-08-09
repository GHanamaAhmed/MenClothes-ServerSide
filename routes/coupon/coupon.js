const router = require("express").Router();
const coupon = require("../../controller/couponController");
router
  .route("/")
  .post(coupon.checkout)
  .get(coupon.fetchCoupon)
  .delete(coupon.deleteCode);
router.route("/addCoupon").post(coupon.postCode);
module.exports = router;
