const router = require("express").Router();
const order = require("../../controller/orderControler");
const { isAdmin, authMiddleware } = require("../../middlewares/middlewareAuth");
router
  .route("/")
  .post(order.postOrder)
  .get(order.getOrder)
  .put(authMiddleware,isAdmin,order.updateOrder);
router.route("/statistique").get(authMiddleware,isAdmin,order.statstique);
module.exports = router;
