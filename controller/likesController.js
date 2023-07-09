const {
  handleLikeValidate,
  fetchLikeValidate,
} = require("../utils/validate/likeValidate");
const likeModel = require("../models/likeModel");
const { fetchOneValidate } = require("../utils/validate/genralValidate");
const { default: mongoose } = require("mongoose");
//export methods

//admin methods
module.exports.fetchLikePost = async (req, res) => {
  const { error } = fetchLikeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id, type, min, max } = req.body;
  const users = await likeModel
    .aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(id), type: type } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      { $project: { users: 1, _id: 0 } },
      {$unwind:"$users"},
      {$replaceRoot:{
        newRoot:"$users"
      }}
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(users);
};

module.exports.fetchLikeUser = async (req, res) => {
  const { error } = fetchLikeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id, type, min, max } = req.body;
  const prodcts = await likeModel
    .aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id), type: type } },
      {
        $lookup: {
          from: "products",
          localField: "postId",
          foreignField: "_id",
          as: "products",
        },
      },
      { $project: { products: 1, _id: 0 } },
      { $unwind: "$products" },
      {
        $replaceRoot: {
          newRoot: "$products"
        }
      }
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(prodcts);
};

//user methods
module.exports.like = async (req, res) => {
  const { error } = handleLikeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const like = await likeModel.findOne({ ...req.body, userId: req.user._id });
  if (like) {
    return res.status(400).send("you have been liked");
  }
  const newLike = new likeModel({
    ...req.body,
    userId: req.user._id,
  });
  await newLike.save();
  return res.status(200).send(newLike);
};
module.exports.unLike = async (req, res) => {
  const { error } = handleLikeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const like = await likeModel.findOneAndDelete({
    ...req.body,
    userId: req.user._id,
  });
  return res.status(200).send(like);
};
