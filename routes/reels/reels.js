const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const reels = require("../../controller/reelsController");
router
  .route("/:min?:max?")
  .get(reels.fetch)
  .post(authMiddleware, isAdmin, reels.upload.single("video"), reels.add)
  .delete(reels.delete)
  .put(authMiddleware, isAdmin, reels.upload.single("video"), reels.update);
module.exports = router;
