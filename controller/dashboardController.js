const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const viewsModel = require("../models/viewsModel");

module.exports.statictique = async (req, res) => {
  const users = await userModel.find().count();
  const lastUsers = await userModel
    .find({
      createAt: {
        $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
      },
    })
    .count();
  const sales = await orderModel.find({ states: "completed" }).count();
  const lastSales = await orderModel
    .find({
      createAt: {
        $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
      },
      states: "completed",
    })
    .count();
  const profits = await orderModel
    .aggregate([
      {
        $group: {
          _id: null,
          prfits: { $sum: "$price" },
        },
      },
    ])
    .then((res) => res.length && (res[0]?.prfits || 0));
  const lastProfits = await orderModel
    .aggregate([
      {
        $match: {
          createAt: {
            $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
          },
          states: "completed",
        },
      },
      {
        $group: {
          _id: null,
          prfits: { $sum: "$price" },
        },
      },
    ])
    .then((res) => res[0]?.prfits || 0);
  const views = await viewsModel
    .findOne({ page: { $exists: false } })
    .then((res) => res.counter);
  res
    .status(200)
    .json({ users, sales, profits, views, lastUsers, lastSales, lastProfits });
};
