const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const users = require("../../controller/usersController");
router
  .route("/:min?:max?")
  .get( users.fetch)
  .post(authMiddleware, users.fetchOne)
  .delete(authMiddleware, isAdmin, users.delete);
module.exports = router;
