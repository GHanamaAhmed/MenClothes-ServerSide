const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const photos = require("../../controller/photoController");
router
  .route("/:type?/:folderName?/:fileName?")
  .get(photos.fetch)
  .delete(authMiddleware, isAdmin, photos.delete);
router.get("/",(req, res) => {
  req.headers.range.replace
});

module.exports = router;
