const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  toUserCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "user",
  },
  type: {
    type: String,
    enum: ["product", "reel"],
    default: "product",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "product",
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  replies: [this],
});
module.exports = mongoose.model("comment", commentSchema);
