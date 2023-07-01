const mongoose = require("mongoose");
const reelSchema = new mongoose.Schema({
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
  viewsUsersIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  video: {
    type: String,
    required: true,
  },
  sharesUserIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});
module.exports = mongoose.model("reel", reelSchema);
