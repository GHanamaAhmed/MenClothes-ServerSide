const router = require("express").Router();
const comments = require("../../controller/commentsController");
const { authMiddleware } = require("../../middlewares/middlewareAuth");
router
  .route("/")
  .get(comments.getComments)
  .post(authMiddleware, comments.sendComment)
  .delete(authMiddleware, comments.deleteComment);

router.route("/replies").get(comments.getReples);
module.exports = router;
