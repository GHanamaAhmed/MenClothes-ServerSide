const couponModel = require("../models/couponModel");
const { couponValidate } = require("../utils/validate/genralValidate");

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
