const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"user"
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref:"user"
  },
  type: {
    type: String,
    enum:["product","reel"],
    default:"product"
  },
  reelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref:"product"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref:"product"
  },
  repndesIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});
module.exports = mongoose.model("comment", commentSchema);
