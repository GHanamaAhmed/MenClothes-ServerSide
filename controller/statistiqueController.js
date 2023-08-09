const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
module.exports.stattistique = async (req, res) => {
  const coupon = await couponModel.find({}).count();
  const lastCoupon = await couponModel
    .find({
      createAt: { $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) },
    })
    .count();
  const restCoupon = await couponModel
    .aggregate([
      {
        $match: {
          $and: [
            { $or: [{ max: { $exists: false } }, { count: { $lt: "$max" } }] },
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
  const lastRestCoupon = await couponModel
    .aggregate([
      {
        $match: {
          $and: [
            {
              createAt: {
                $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
              },
            },
            { $or: [{ max: { $exists: false } }, { count: { $lt: "$max" } }] },
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
  const lastUsedCoupon = await couponModel.aggregate([
    {
      $match: {
        count: { $gt: 0 },
        createAt: { $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) },
      },
    },
  ]);
  const couponSales = (await orderModel.find({ coupon: { $exists: true } }))
    .length;
  const lastCouponSales = (
    await orderModel.find({
      coupon: { $exists: true },
      createAt: { $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) },
    })
  ).length;
  res
    .status(200)
    .json({ coupon, lastCoupon, restCoupon, usedCoupon, couponSales,lastCouponSales,lastRestCoupon,lastUsedCoupon });
};
