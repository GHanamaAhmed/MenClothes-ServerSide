const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwoard: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
    enum: ["client", "admin"],
    default: "client",
  },
  tel: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  Photo: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  sex: {
    type: String,
    required: true,
  },
  token: {
    type: [String],
    required: false,
    unique: true,
  },
  commentsIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  likesIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  basketsIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.paswoard = bcrypt.hashSync(this.paswoard, salt);
  next();
});
userSchema.statics.login = async (email, passwoard) => {
  let user = await this.findOne({ email });
  if (!user) throw new Error("Email not valid!");
  bcrypt.compare(passwoard, user.passwoard, (err, result) => {
    if (err) throw new Error(err);
    if (!result) throw new Error("password not valid");
  });
  return user;
};
module.exports = mongoose.model("user", userSchema);
