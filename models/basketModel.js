const mongoose = require("mongoose");
const basketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "product",
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

module.exports = mongoose.model("basket", basketSchema);
