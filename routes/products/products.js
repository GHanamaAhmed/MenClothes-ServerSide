const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const products = require("../../controller/productsController");
router
  .route("/:min?:max?")
  .get(products.fetch)
  .post(
    authMiddleware,
    isAdmin,
    products.initialize,
    products.upload.fields([
      { name: "photos" },
      { name: "thumbanil", maxCount: 1 },
    ]),
    products.add
  )
  .delete(authMiddleware, isAdmin, products.delete)
  .put(
    authMiddleware,
    isAdmin,
    products.initialize,
    products.upload.fields([
      { name: "photos" },
      { name: "thumbanil", maxCount: 1 },
    ]),
    products.update
  );
router.use((error, req, res, next) => {
  if (error instanceof MulterError) {
    return res.status(400).send("this is unexpected field -> "+error.field);
  }
});
module.exports = router;
