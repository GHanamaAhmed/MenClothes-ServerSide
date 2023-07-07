const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const photos = require("../../controller/photoController");
router
  .route("/:type?/:folderName?/:fileName?")
  .get(photos.fetch)
  .delete(photos.delete)

module.exports = router;
