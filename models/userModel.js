const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  provider: {
    type: String,
  },
  clientId: {
    type: String,
  },
  email: {
    type: String,
  },
  birthday:{
    type: String,
  },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  phone: {
    type: String,
  },
  Photo: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  sex: {
    type: String,
  },
  token: {
    type: [String],
  },
  commentsIds: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  likesIds: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  basketsIds: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

module.exports = mongoose.model("user", userSchema);
