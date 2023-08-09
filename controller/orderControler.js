const { rangeValidate } = require("../utils/validate/genralValidate");
const {
  addOrderValidate,
  productsItemValidate,
  updateOrderValidate,
} = require("../utils/validate/orderValidate");
const likeModel = require("../models/likeModel");
const orderModel = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

module.exports.postOrder = async (req, res) => {
  const { error } = addOrderValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const order = new orderModel({
    ...req.body,
  });
  await order.save();
  res.status(200).send(order);
};
module.exports.getOrder = async (req, res) => {
  const { error } = rangeValidate.validate(req.query);
  if (error) return res.status(400).send(error.message);
  const { min, max, type, name, reverse } = req.query;
  const orders = await orderModel.aggregate([
    {
      $match: {
        $and: type
          ? [
              { states: { $regex: type ? type : "" } },
              { states: { $ne: "removed" } },
              {
                $or: [
                  { name: { $regex: name ? name : "" } },
                  { email: { $regex: name ? name : "" } },
                  { adress: { $regex: name ? name : "" } },
                ],
              },
            ]
          : [
              { states: { $ne: "removed" } },
              {
                $or: [
                  { name: { $regex: name ? name : "" } },
                  { email: { $regex: name ? name : "" } },
                  { adress: { $regex: name ? name : "" } },
                ],
              },
            ],
      },
    },
    {
      $lookup: {
        from: "orders",
        let: { userId: "$userId", phone: "$phone" },
        pipeline: [
          {
            $match: {
              $expr: { $or: [{ userId: "$$userId" }, { phone: "$$phone" }] },
            },
          },
          {
            $group: {
              _id: "$states",
              count: { $sum: 1 },
            },
          },
        ],
        as: "status",
      },
    },
    { $sort: { createAt: reverse ? 1 : -1 } },
    { $skip: Number(min) > 0 ? Number(min) : 0 },
    {
      $limit:
        Number(max) > 0 ? Number(max) : Number(min) > 0 ? Number(min) + 10 : 10,
    },
  ]);
  res.status(200).send(orders);
};
module.exports.updateOrder = async (req, res) => {
  const { error } = updateOrderValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const body = req.body;
  const id = body.id;
  delete body.id;
  const o = await orderModel.findByIdAndUpdate(
    id,
    { $set: { ...body } },
    { new: true }
  );
  const order = await orderModel
    .aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { userId: "$userId", phone: "$phone" },
          pipeline: [
            {
              $match: {
                $expr: { $or: [{ userId: "$$userId" }, { phone: "$$phone" }] },
              },
            },
            {
              $group: {
                _id: "$states",
                count: { $sum: 1 },
              },
            },
          ],
          as: "status",
        },
      },
    ])
    .then((res) => (res.length ? res[0] : null));
  res.status(200).send(order);
};
module.exports.statstique = async (req, res) => {
  const orders = await orderModel.find({ states: { $ne: "removed" } }).count();
  const lastOrders = await orderModel
    .find({
      states: { $ne: "removed" },
      createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
    })
    .count();
  const likes = await likeModel.find({ type: "product" }).count();
  const lastLikes = await likeModel
    .find({
      type: "product",
      createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
    })
    .count();
  const sales = await orderModel.find({ states: "completed" }).count();
  const lastSales = await orderModel
    .find({
      createAt: {
        $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
      },
      states: "completed",
    })
    .count();
  const returns = await orderModel.find({ states: "return" }).count();
  const lastReturns = await orderModel
    .find({
      states: "return",
      createAt: {
        $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
      },
    })
    .count();
  res.status(200).json({
    orders,
    lastOrders,
    likes,
    lastLikes,
    sales,
    lastSales,
    returns,
    lastReturns,
  });
};
