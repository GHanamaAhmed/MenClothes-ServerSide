const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
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
