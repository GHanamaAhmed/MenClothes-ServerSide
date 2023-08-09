const couponModel = require("../models/couponModel");
const {
  postCaodeValidate,
  fetchCaodeValidate,
} = require("../utils/validate/couponValidate");
const {
  couponValidate,
  fetchOneValidate,
} = require("../utils/validate/genralValidate");

module.exports.checkout = async (req, res) => {
  const { error } = couponValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const coupon = await couponModel.findOne({ code: req.code });
  if (!coupon) return res.status(400).send("الكود خاطئ!");
  if (coupon?.max || coupon?.expireAt) {
    if (
      coupon?.max + 1 < coupon?.count ||
      coupon?.expireAt - coupon.createAt <= 0
    ) {
      return res.status(400).send("انتهت صلحية الكود!");
    } else {
      coupon.count = coupon.count + 1;
      await coupon.save();
      return res.status(200).send(coupon);
    }
  }
};
module.exports.postCode = async (req, res) => {
  const body = req.body;
  if (!body?.porcent && !body?.price) {
    return res.status(400).send("يجب ادخال التخفيض");
  }
  const { error } = postCaodeValidate.validate(body);
  if (!body?.porcent && !body?.price) {
    return res.status(400).send("يجب ادخال التخفيض");
  }
  if (error) return res.status(400).send(error.message);
  const prevCoupon = await couponModel.findOne({ code: body?.code });
  if (prevCoupon) return res.status(400).send("!هذا الكود موجود");
  let coupon;
  if (body?.porcent !== undefined) {
    const porcent = body.porcent / 100;
    delete body?.porcent;
    coupon = new couponModel({
      ...body,
      porcent,
      expireAt: new Date(new Date() + Number(body.expireAt) * 1000 * 60 * 60 * 24),
    });
  } else {
    coupon = new couponModel({
      ...body,
      expireAt: new Date(new Date() + Number(body.expireAt) * 1000 * 60 * 60 * 24),
    });
  }
  await coupon.save();
  res.status(200).send(coupon);
};
module.exports.deleteCode = async (req, res) => {
  const { error } = fetchOneValidate.validate(req.body);
  if (error) return res.status(400).send(error.message);
  const coupon = await couponModel.findByIdAndDelete(req.body?.id);
  res.status(200).send(coupon);
};
module.exports.fetchCoupon = async (req, res) => {
  try {
    const { error } = fetchCaodeValidate.validate(req.query);
    if (error) return res.status(400).send(error.message);
    const { min, max, used, expire, reverse, name } = req.query;
    const coupons = await couponModel.aggregate([
      { $skip: Number(min) > 0 ? Number(min) : 0 },
      {
        $limit:
          Number(max) > 0
            ? Number(max)
            : Number(min) > 0
            ? Number(min) + 10
            : 10,
      },
      {
        $match: {
          $and: [
            { code: { $regex: name ? name : "" } },
            expire !== undefined
              ? {
                  $and: expire
                    ? [
                        { count: { $gte: "$max" } },
                        { expireAt: { $lte: new Date() } },
                      ]
                    : [
                        { count: { $lt: "$max" } },
                        { expireAt: { $gt: new Date() } },
                      ],
                }
              : {},
            used !== undefined
              ? {
                  $and: used
                    ? [{ count: { $gt: 0 } }]
                    : [{ count: { $eq: 0 } }],
                }
              : {},
          ],
        },
      },
      { $sort: { createAt: reverse ? 1 : -1 } },
    ]);
    res.status(200).send(coupons);
  } catch (err) {
    res.status(400).send(err);
  }
};
