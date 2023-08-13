const commentModel = require("../models/commentModel");
const couponModel = require("../models/couponModel");
const likeModel = require("../models/likeModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const reelModel = require("../models/reelModel");
const userModel = require("../models/userModel");
const viewsModel = require("../models/viewsModel");

module.exports.statictique = async (req, res) => {
  const products = await productModel.find({}).count();
  const lastProducts = await productModel
    .find({
      createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
    })
    .count();
  const users = await userModel.find().count();
  const lastUsers = await userModel
    .find({
      createAt: {
        $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
      },
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
            $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
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
    .find({ page: { $exists: false } })
    .then((res) => res.length);

  const coupon = await couponModel.find({}).count();
  const lastCoupon = await couponModel
    .find({
      createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
    })
    .count();
  const restCoupon = await couponModel
    .aggregate([
      {
        $match: {
          $expr: {
            $or: [{ $lte: ["$max", 0] }, { $lt: ["$count", "$max"] }],
          },
          $or: [
            { expireAt: { $exists: false } },
            { expireAt: { $gte: new Date() } },
          ],
        },
      },
    ])
    .then((res) => res.length);
  const lastRestCoupon = await couponModel
    .aggregate([
      {
        $match: {
          $expr: {
            $or: [{ $lte: ["$max", 0] }, { $lt: ["$count", "$max"] }],
          },
          $and: [
            {
              createAt: {
                $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
              },
            },
            {
              $or: [
                { expireAt: { $exists: false } },
                { expireAt: { $gte: new Date() } },
              ],
            },
          ],
        },
      },
    ])
    .then((res) => res.length);
  const usedCoupon = (await couponModel.find({ count: { $gt: 0 } })).length;
  const lastUsedCoupon = await couponModel
    .aggregate([
      {
        $match: {
          count: { $gt: 0 },
          createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
        },
      },
    ])
    .then((res) => res.length);
  const couponSales = await orderModel
    .aggregate([
      { $match: { coupon: { $exists: true }, states: "completed" } },
      {
        $group: {
          _id: null,
          count: { $sum: { $toDouble: "$disCount.price" } },
        },
      },
    ])
    .then((res) => res?.[0]?.count || 0);
  const lastCouponSales = await orderModel
    .aggregate([
      {
        $match: {
          coupon: { $exists: true },
          states: "completed",
          createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: { $toDouble: "$disCount.price" } },
        },
      },
    ])
    .then((res) => res?.[0]?.count || 0);

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

  const returns = await orderModel.find({ states: "return" }).count();
  const lastReturns = await orderModel
    .find({
      states: "return",
      createAt: {
        $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
      },
    })
    .count();
  const reels = await reelModel.find({}).count();
  const lastReels = await reelModel
    .find({
      createAt: { $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30) },
    })
    .count();
  const comment = await commentModel.find({ type: "reel" }).count();
  const lastComment = await commentModel
    .find({
      type: "reel",
      createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
    })
    .count();
  const viewsReels = await reelModel
    .aggregate([
      {
        $project: {
          viewsUsersIds: 1,
        },
      },
      { $addFields: { views: { $size: "$viewsUsersIds" } } },
      {
        $group: {
          _id: null,
          views: { $sum: "$views" },
        },
      },
    ])
    .then((data) => data.length && (data[0]?.views || 0));
  const lastViewsReels = await reelModel
    .aggregate([
      { $project: { viewsUsersIds: 1 } },
      { $unwind: "$viewsUsersIds" },
      {
        $match: {
          "viewsUsersIds.createAt": {
            $gt: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
          },
        },
      },
      {
        $count: "views",
      },
    ])
    .then((data) => data.length && (data[0]?.views || 0));

  const lastView = await viewsModel
    .find({
      page: { $exists: false },
      createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
    })
    .then((res) => res.length);
  res.status(200).json({
    users,
    sales,
    profits,
    views,
    lastUsers,
    lastSales,
    lastProfits,
    coupon,
    lastCoupon,
    restCoupon,
    usedCoupon,
    lastUsedCoupon,
    lastRestCoupon,
    couponSales,
    lastCouponSales,
    orders,
    lastOrders,
    likes,
    lastLikes,
    returns,
    lastReturns,
    reels,
    lastReels,
    comment,
    lastComment,
    viewsReels,
    lastViewsReels,
    products,
    lastProducts,
    lastView,
  });
};
