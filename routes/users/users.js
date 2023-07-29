const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const users = require("../../controller/usersController");
router.get("/getInfo", authMiddleware, users.fetchOne);
router.route("/views").get(users.fetchViews).post(users.increaseViews);
router
  .route("/")
  .get(authMiddleware, isAdmin, users.fetch)
  .delete(authMiddleware, isAdmin, users.delete);
module.exports = router;
