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
  try {
    const { error } = couponValidate.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const coupon = await couponModel.findOne({ code: req.body?.code });
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
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.postCode = async (req, res) => {
  try {
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
      });
    } else {
      coupon = new couponModel({
        ...body,
      });
    }
    await coupon.save();
    res.status(200).send(coupon);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.deleteCode = async (req, res) => {
  try {
    const { error } = fetchOneValidate.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const coupon = await couponModel.findByIdAndDelete(req.body?.id);
    res.status(200).send(coupon);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.fetchCoupon = async (req, res) => {
  try {
    const { error } = fetchCaodeValidate.validate(req.query);
    if (error) return res.status(400).send(error.message);
    const { min, max, used, expire, reverse, name } = req.query;
    const coupons = await couponModel.aggregate([
      {
        $match: {
          $expr: {
            $and:
              expire !== undefined
                ? Number(expire)
                  ? [
                      {
                        $or: [
                          { $gte: ["$count", "$max"] },
                          { $lte: ["$expireAt", new Date()] },
                        ],
                      },
                      { $gt: ["$expireAt", 0] },
                    ]
                  : [
                      {
                        $or: [
                          { $lt: ["$count", "$max"] },
                          { $gt: ["$expireAt", new Date()] },
                        ],
                      },
                    ]
                : [],
          },
          $and: [
            {
              code: { $regex: name ? name : "" },
            },
            used !== undefined
              ? {
                  $and: Number(used)
                    ? [{ count: { $gt: 0 } }]
                    : [{ count: { $eq: 0 } }],
                }
              : {},
          ],
        },
      },
      { $sort: { createAt: Number(reverse) ? 1 : -1 } },
    ]);
    console.log(Number(min), Number(max));
    res.status(200).send({
      coupons: coupons.slice(min, max),
      count: coupons.length,
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
