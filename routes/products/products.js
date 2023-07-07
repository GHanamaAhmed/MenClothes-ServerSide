const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const products = require("../../controller/productsController");
router
  .route("/:min?:max?")
  .get(products.fetch)
  .post(products.upload.array("photos"), products.add)
  .delete( products.delete)
  .put(
    products.upload.array("photos"),
    products.update
  );
router.delete("/photo");
module.exports = router;
