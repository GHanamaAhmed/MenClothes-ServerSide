const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const products = require("../../controller/productsController");
router
  .route("/:min?:max?")
  .get(products.fetch)
  .post(
    products.initialize,
    products.upload.fields([{ name: "photos" }, { name: "thumbanil" }]),
    products.add
  )
  .delete(products.delete)
  .put(
    authMiddleware,
    isAdmin,
    products.initialize,
    products.upload.fields([{ name: "photos" }, { name: "thumbanil" }]),
    products.update
  );
module.exports = router;
