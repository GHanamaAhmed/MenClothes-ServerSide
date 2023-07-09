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
const { fetchBasketValidate } = require("../utils/validate/basketValidate");
//export methods

//admin methods
module.exports.fetchBasketProduct = async (req, res) => {
  const { error } = fetchBasketValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id, min, max } = req.body;
  const users = await basketModel
    .aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(id) } },
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
  const { error } = fetchBasketValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id,  min, max } = req.body;
  const prodcts = await basketModel
    .aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id)} },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "products",
        },
      },
      { $project: { products: 1, _id: 0 } },
      {$unwind:"$products"},{
        $replaceRoot:{
          newRoot:"$products"
        }
      }
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(prodcts);
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
