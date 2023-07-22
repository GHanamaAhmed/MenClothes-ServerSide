const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const basket = require("../../controller/basketController");
router
  .route("/:id?")
  .get(authMiddleware, basket.fetch)
  .post(authMiddleware, basket.save)
  .delete(authMiddleware, basket.unsave);
router
  .route("/product")
  .post(authMiddleware, isAdmin, basket.fetchBasketProduct);
router.route("/user").post(authMiddleware, basket.fetchLikeUser);
module.exports = router;
