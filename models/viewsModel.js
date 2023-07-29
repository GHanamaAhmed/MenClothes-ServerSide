const mongoose = require("mongoose");
const viewsSchema = new mongoose.Schema({
  page: {
    type: String,
  },
  counter: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("views", viewsSchema);
