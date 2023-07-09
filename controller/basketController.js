const {
  handleLikeValidate,
  fetchLikeValidate,
} = require("../utils/validate/likeValidate");
const likeModel = require("../models/likeModel");
const {
  fetchOneValidate,
  removeValidate,
} = require("../utils/validate/genralValidate");
const { default: mongoose } = require("mongoose");
const basketModel = require("../models/basketModel");
//export methods

//admin methods
module.exports.fetchLikePost = async (req, res) => {
  const { error } = fetchLikeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id, type, min, max } = req.body;
  const users = await likeModel
    .aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id), type: type } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      { $project: { users: 1, _id: 0 } },
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(users[0]?.users);
};

module.exports.fetchLikeUser = async (req, res) => {
  const { error } = fetchLikeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id, type, min, max } = req.body;
  const prodcts = await likeModel
    .aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(id), type: type } },
      {
        $lookup: {
          from: "products",
          localField: "postId",
          foreignField: "_id",
          as: "products",
        },
      },
      { $project: { products: 1, _id: 0 } },
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(prodcts[0]?.products);
};

//user methods
module.exports.save = async (req, res) => {
  const { error } = fetchOneValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const basket = await basketModel.findOne({
    userId: req.user._id,
    productId: req.body.id,
  });
  if (basket) {
    return res.status(400).send("this product in basket");
  }
  const newBasket = new basketModel({
    userId: req.user._id,
    productId: req.body.id,
  });
  await newBasket.save();
  return res.status(200).send(newBasket);
};
module.exports.unsave = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const basket = await basketModel.findOneAndDelete({
    productId: req.body.id,
    userId: req.user._id,
  });
  return res.status(200).send(basket);
};
