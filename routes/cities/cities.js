const router=require("express").Router()
const cities=require("../../controller/citiesController")
router.get("/wilaya",cities.fetchWilaya)
router.get("/wilaya/:id",cities.fetchBaladya)
module.exports=router