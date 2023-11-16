const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  porcent: {
    type: Number,
  },
  price: {
    type: Number,
  },
  max: {
    type: Number,
  },
  count: {
    type: Number,
    default:0
  },
  expireAt: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("coupon", couponSchema);
