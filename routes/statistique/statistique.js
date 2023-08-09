const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const statistique = require("../../controller/statistiqueController");
router.get("/",  statistique.stattistique);
module.exports = router;
