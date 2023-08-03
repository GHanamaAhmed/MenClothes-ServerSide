const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const products = require("../../controller/productsController");
router
  .route("/")
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
router.get("/product/:id?", products.fetchOne);
router.get("/count", products.count);
router.get("/statistique", products.statstique);
router.use((error, req, res, next) => {
  return res.status(400).send(error);
});
module.exports = router;
