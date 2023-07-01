const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum:["product","reel"],
    default:"product"
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});
module.exports = mongoose.model("like", likeSchema);
