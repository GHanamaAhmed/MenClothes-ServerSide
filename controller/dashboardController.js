const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

module.exports.statictique = (req, res) => {
    const nUser=userModel.find().count()
    const nSales=orderModel.find({})
};
