const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const photos = require("../../controller/photoController");
router
  .route("/:folderName?/:id?/:fileName?")
  .get(photos.fetch)
  
module.exports = router;
