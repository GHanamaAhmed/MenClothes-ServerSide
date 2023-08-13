const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../../middlewares/middlewareAuth");
const statistique = require("../../controller/statistiqueController");
router.get("/", authMiddleware, isAdmin, statistique.stattistique);
router.post("/", statistique.addview);
module.exports = router;
