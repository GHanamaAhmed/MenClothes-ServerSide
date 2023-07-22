const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const users = require("../../controller/usersController");
router.get("/getInfo", authMiddleware, users.fetchOne);
router
  .route("/:min?:max?")
  .get(authMiddleware, isAdmin, users.fetch)
  .delete(authMiddleware, isAdmin, users.delete);
module.exports = router;
