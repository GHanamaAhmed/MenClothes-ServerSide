const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
<<<<<<< HEAD
    required: false,
=======
    required: true,
>>>>>>> 64ab94f92e8a151b7365efa23396151d6e0e86ff
  },
  reelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "reel",
  },
  photos: {
    type: [
      { photo: String, sizes: [String], colors: [String], quntity: Number },
    ],
    required: false,
  },
  thumbanil: {
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: false,
  },
  promotion: {
    type: String,
    required: false,
  },
<<<<<<< HEAD
=======
  type: {
    type: String,
    required: false,
  },
>>>>>>> 64ab94f92e8a151b7365efa23396151d6e0e86ff
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
<<<<<<< HEAD
    if (this.quntity > 0) {
      this.status = true;
    } else {
      this.status = false;
    }
  }
  if (this.showPrice === undefined) {
    if ( this.price === undefined) {
=======
    this.status = true;
  } else {
    if (this.quntity === null || this.status === undefined) {
      if (this.quntity > 0) {
        this.status = true;
      } else {
        this.status = false;
      }
    }
  }
  if (this.showPrice === undefined) {
    if (this.price === undefined) {
>>>>>>> 64ab94f92e8a151b7365efa23396151d6e0e86ff
      this.showPrice = false;
    } else {
      this.showPrice = true;
    }
  }
  if (this.showPromotion === undefined) {
    if (this.promotion === undefined) {
      this.showPromotion = false;
    } else {
      this.showPromotion = true;
    }
  }
  next();
});
module.exports = mongoose.model("product", productSchema);
