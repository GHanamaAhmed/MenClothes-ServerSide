const { isAdmin } = require("../middlewares/middlewareAuth");
const ProductModel = require("../models/productModel");
const UserModel = require("../models/userModel");
const viewsModel = require("../models/viewsModel");
const {
  removeValidate,
  fetchOneValidate,
  rangeValidate,
} = require("../utils/validate/genralValidate");
const {
  addProductValidate,
  updateProductValidate,
} = require("../utils/validate/productValidate");

module.exports.fetch = async (req, res) => {
  const { error } = rangeValidate.validate(req.params);
  if (error) return res.status(400).send(error.message);
  const { max, min } = req.params;
  const users = await UserModel.aggregate([
    {
      $lookup: {
        from: "orders",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              userId: "$$userId",
            },
          },
          {
            $addFields: {
              products: { $size: "$productsIds" },
            },
          },
          {
            $project: {
              products: 1,
              price: 1,
            },
          },
        ],
        as: "orders",
      },
    },
    {
      $addFields: {
        price: { $sum: "$orders.price" },
        products: { $sum: "$orders.products" },
      },
    },
    {
      $project: {
        orders: 0,
      },
    },
  ]);
  const userSlice = users.slice(min, max);
  res.status(200).send(userSlice);
};
module.exports.increaseViews = async (req, res) => {
  let views = await viewsModel.find({ page: { $exists: false } });
  if (views) {
    views = new viewsModel({ counter: 0 });
  }
  views.counter = views.counter + 1;
  await views.save();
  res.status(200).send({ counter: views.counter });
};
module.exports.fetchViews = async (req, res) => {
  let views = await viewsModel.find({ page: { $exists: false } });
  if (views) {
    views = new viewsModel({ counter: 0 });
  }
  await views.save();
  res.status(200).send({ counter: views.counter });
};
module.exports.fetchOne = async (req, res) => {
  const isAdmin = req?.user?.role == "admin";
  if (!req.body?.id || !isAdmin) {
    return res.status(200).send(req.user);
  }
  const user = await UserModel.findById(req.body.id);
  res.status(200).send(user);
};
module.exports.delete = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const user = await UserModel.findByIdAndDelete(req.body.id, { new: true });
  res.status(200).send(user);
};
