const mongoose = require("mongoose");
const viewsSchema = new mongoose.Schema({
  page: {
    type: String,
  },
  counter: {
    type: Number,
  },
  sessionId: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("views", viewsSchema);
