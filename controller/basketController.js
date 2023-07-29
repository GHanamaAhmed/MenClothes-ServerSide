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
const {
  fetchBasketValidate,
  addBasketValidate,
} = require("../utils/validate/basketValidate");
const productModel = require("../models/productModel");
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
      { $unwind: "$users" },
      {
        $replaceRoot: {
          newRoot: "$users",
        },
      },
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(users);
};

module.exports.fetchLikeUser = async (req, res) => {
  const { error } = fetchBasketValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { id, min, max } = req.body;
  const user = req?.user;
  if (id && user?.role == "client") return res.status(405).send();
  const prodcts = await basketModel
    .aggregate([
      { $match: { userId: id ? new mongoose.Types.ObjectId(id) : user?._id } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "products",
        },
      },
      { $project: { products: 1, _id: 0 } },
      { $unwind: "$products" },
      {
        $replaceRoot: {
          newRoot: "$products",
        },
      },
    ])
    .then((res) => res.slice(min, max));
  return res.status(200).send(prodcts);
};

//user methods
module.exports.fetch = async (req, res) => {
  const { id } = req.params;
  const user = req?.user;
  if (id && user?.role == "client") return res.status(405).send();
  const prodcts = await basketModel.aggregate([
    { $match: { userId: id ? new mongoose.Types.ObjectId(id) : user?._id } },
  ]);
  return res.status(200).send(prodcts);
};

module.exports.save = async (req, res) => {
  const { error } = addBasketValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  console.log(req.body);
  const id = req.body?.id;
  const body = req.body;
  delete body?.id;
  const basket = await basketModel.findOne({
    userId: req.user._id,
    productId: id,
    ...body,
  });
  if (basket) {
    return res.status(400).send("this product in basket");
  }
  const product = await productModel.findById(id);
  if (product?.status === false || !product)
    return res.status(400).send("This product not available!");
  const newBasket = new basketModel({
    userId: req.user._id,
    productId: id,
    ...body,
  });
  await newBasket.save();
  return res.status(200).send(newBasket);
};
module.exports.unsave = async (req, res) => {
  const { error } = addBasketValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const id = req.body?.id;
  const body = req.body;
  delete body?.id;
  const basket = await basketModel.findOneAndDelete({
    productId: id,
    userId: req.user._id,
    ...body,
  });
  const basket2 = await basketModel.findByIdAndDelete(id);
  return res.status(200).send(basket || basket2);
};
