const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const reels = require("../../controller/reelsController");
const { MulterError } = require("multer");
router.route("/reel/:id").get(reels.fetchOne);
router
  .route("/:id?")
  .get(reels.fetchAll)
  .post(authMiddleware, isAdmin, reels.upload.single("video"), reels.add)
  .delete(authMiddleware, isAdmin, reels.delete)
  .put(authMiddleware, isAdmin, reels.upload.single("video"), reels.update);
router.use((error, req, res, next) => {
  if (error) return res.status(400).send(error);
});
module.exports = router;
