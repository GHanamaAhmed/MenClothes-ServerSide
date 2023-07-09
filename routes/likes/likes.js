const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const likes = require("../../controller/likesController");
router
  .route("/")
  .post(authMiddleware, likes.like)
  .delete(authMiddleware, likes.unLike);
router.route("/product").post(authMiddleware, isAdmin, likes.fetchLikePost);
router.route("/user").post(authMiddleware, isAdmin, likes.fetchLikeUser);
module.exports = router;
