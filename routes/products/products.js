const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const products = require("../../controller/productsController");
router
  .route("/:min?:max?")
  .get(products.fetch)
  .post(
    authMiddleware,
    isAdmin,
    products.add,
    products.upload.array("photos"),
    products.store
  )
  .delete(authMiddleware, isAdmin, products.delete)
  .put(authMiddleware, isAdmin, products.update);
module.exports = router;
