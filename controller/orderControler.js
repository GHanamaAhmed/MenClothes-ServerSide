const { rangeValidate } = require("../utils/validate/genralValidate");
const {
  addOrderValidate,
  productsItemValidate,
  updateOrderValidate,
} = require("../utils/validate/orderValidate");
const likeModel = require("../models/likeModel");
const orderModel = require("../models/orderModel");
const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");

module.exports.postOrder = async (req, res) => {
  // try {
  const { error } = addOrderValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const products = await Promise.all(
    req.body.productsIds.map(async (e, i) => await productModel.findById(e.id))
  );
  const restQuntity = products.map(
    (e, i) =>
      e.photos[
        e.photos.findIndex(
          (e) =>
            e.color == req.body.productsIds[i].color &&
            e.sizes.includes(req.body.productsIds[i].size)
        )
      ].quntity - req.body.productsIds[i].quntity
  );
  console.log(restQuntity);
  console.log(restQuntity.some((e) => e <= 0));
  if (restQuntity.some((e) => e < 0)) {
    const quntity = products.map(
      (e, i) =>
        e.photos[
          e.photos.findIndex(
            (e) =>
              e.color == req.body.productsIds[i].color &&
              e.sizes.includes(req.body.productsIds[i].size)
          )
        ].quntity
    );
    console.log(quntity);
    return res.status(200).json({ error: quntity });
  }
  const order = new orderModel({
    ...req.body,
  });
  await order.save();
  res.status(200).send(order);
  // } catch (e) {
  //   res.status(400).send(e);
  // }
};

module.exports.getOrder = async (req, res) => {
  try {
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
                    { phone: { $regex: name ? name : "" } },
                    { name: { $regex: name ? name : "" } },
                    { email: { $regex: name ? name : "" } },
                    { adress: { $regex: name ? name : "" } },
                    { city: { $regex: name ? name : "" } },
                  ],
                },
              ]
            : [
                { states: { $ne: "removed" } },
                {
                  $or: [
                    { phone: { $regex: name ? name : "" } },
                    { name: { $regex: name ? name : "" } },
                    { email: { $regex: name ? name : "" } },
                    { adress: { $regex: name ? name : "" } },
                    { city: { $regex: name ? name : "" } },
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
    ]);
    res
      .status(200)
      .send({ orders: orders.slice(min, max), count: orders.length });
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.updateOrder = async (req, res) => {
  const { error } = updateOrderValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const body = req.body;
  const id = body.id;
  delete body.id;
  const order2 = await orderModel.findByIdAndUpdate(id, {
    $set: { ...body },
  });
  const states = body?.states;
  // change quntity after order changed
  if (states != "removed") {
    if (
      order2.states != "completed" &&
      order2.states != "accepted" &&
      (states == "completed" || states == "accepted")
    ) {
      await Promise.all(
        order2.productsIds.map(async (e) => {
          const prod = await productModel.findById(e.id);
          if (!prod) return;
          await Promise.all(
            prod.photos.map(async (el) => {
              if (el.color == e.color && el.sizes.includes(e.size)) {
                el.quntity = el.quntity - e.quntity || 0;
              }
            })
          );
          await prod.save();
        })
      );
    } else {
      if (
        (order2.states == "completed" || order2.states == "accepted") &&
        states != "completed" &&
        states != "accepted"
      ) {
        await Promise.all(
          order2.productsIds.map(async (e) => {
            const prod = await productModel.findById(e.id);
            if (!prod) return;
            await Promise.all(
              prod.photos.map(async (el) => {
                if (el.color == e.color && el.sizes.includes(e.size)) {
                  el.quntity = el.quntity + e.quntity;
                }
              })
            );
            await prod.save();
          })
        );
      }
    }
  }
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
                $expr: {
                  $or: [{ userId: "$$userId" }, { phone: "$$phone" }],
                },
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
  try {
    const orders = await orderModel
      .find({ states: { $ne: "removed" } })
      .count();
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
  } catch (e) {
    res.status(400).send(e);
  }
};
