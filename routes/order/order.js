const router = require("express").Router();
const order = require("../../controller/orderControler");
router
  .route("/")
  .post(order.postOrder)
  .get(order.getOrder)
  .put(order.updateOrder);
router.route("/statistique").get(order.statstique);
module.exports = router;
