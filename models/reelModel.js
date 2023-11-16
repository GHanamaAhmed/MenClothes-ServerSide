const mongoose = require("mongoose");
const reelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  viewsUsersIds: {
    type: [{ createAt: { type: Date, default: Date.now }, userId: String }],
    required: false,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "product",
  },
  thumbanil: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: true,
  },
  sharesUserIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    ref: "user",
  },
});
module.exports = mongoose.model("reel", reelSchema);
