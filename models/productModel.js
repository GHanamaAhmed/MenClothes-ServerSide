const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  likesIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  commentsIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  quntity: {
    type: Number,
    required: false,
  },
  price: {
    type: String,
    required: false,
  },
  basketsIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  reelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  colors: {
    type: [String],
    required: false,
  },
  sizes: {
    type: [String],
    required: false,
  },
  puchaseUsersIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  ordersIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  photos: {
    type: [String],
    required: false,
  },
  path:{
    type: String,
    required: false,
  },
  promotion: {
    type: String,
    required: false,
  },
  showPromotion: {
    type: Boolean,
    require: false,
  },
  showPrice: {
    type: Boolean,
    require: false,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
});
productSchema.pre("save", function (next) {
  if (this.status === null || this.status === undefined) {
    if (this.quntity > 0) {
      this.status = true;
    } else {
      this.status = false;
    }
  }
  if (this.showPrice === null || this.showPrice === undefined) {
    if (this.price !== null || this.price !== undefined) {
      this.showPrice = false;
    } else {
      this.showPrice = true;
    }
  }
  if (this.showPromotion === null || this.showPromotion === undefined) {
    if (this.promotion !== null || this.promotion !== undefined) {
      this.showPromotion = false;
    } else {
      this.showPromotion = true;
    }
  }
  next();
});
module.exports = mongoose.model("product", productSchema);
