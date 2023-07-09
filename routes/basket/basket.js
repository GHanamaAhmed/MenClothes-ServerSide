const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const basket = require("../../controller/basketController");
router
  .route("/")
  .post(authMiddleware, basket.save)
  .delete(authMiddleware, basket.unsave);
router.route("/product").post(authMiddleware, basket.fetchBasketProduct);
router.route("/user").post(authMiddleware, basket.fetchLikeUser);
module.exports = router;
