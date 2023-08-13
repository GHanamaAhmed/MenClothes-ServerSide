const router = require("express").Router();
const coupon = require("../../controller/couponController");
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
router
  .route("/")
  .post(coupon.checkout)
  .get(authMiddleware, isAdmin, coupon.fetchCoupon)
  .delete(authMiddleware, isAdmin, coupon.deleteCode);
router.route("/addCoupon").post(authMiddleware, isAdmin, coupon.postCode);
module.exports = router;
