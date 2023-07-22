const ProductModule = require("./productModel");
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  productsIds: {
    type: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quntity: Number,
        size: Number,
        color: Number,
      },
    ],
    required: true,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  price: {
    type: String,
    required: true,
  },
  stateus: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
    default: "pending",
  },
});
orderSchema.pre("save", async function (next) {
  if (this.price === null || this.price === undefined) {
    let products = await Promise.all(
      this.productsIds.map(async (e, i) => await ProductModule.findById(e.id))
    );
    let p = products.filter(
      (e) => (!e.showPrice || !e.price) && (!e.showPromotion || !e.promotion)
    );
    if (!p.length) {
      let productsPrices = products.map((e) => {
        if (e.promotion && e.showPromotion) {
          return e.promotion * this.productsIds[i].quntity;
        }
        if (e.price && e.showPrice) {
          return e.price * this.productsIds[i].quntity;
        }
      });
      this.price = productsPrices.reduce((sum, num) => sum + num, 0);
    }
  }
  next();
});
module.exports = mongoose.model("order", orderSchema);
