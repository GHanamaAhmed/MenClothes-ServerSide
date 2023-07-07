const joi = require("joi");
const addProductValidate = joi.object({
  name: joi.string().min(1).max(50).required(),
  reelId: joi.string(),
  quntity: joi.number().min(0),
  price: joi.number(),
  colors: joi.array(),
  sizes: joi.array(),
  photos: joi.any(),
  promotion: joi.number(),
  description: joi.string(),
  status: joi.boolean(),
  showPrice: joi.boolean(),
  showPromotion: joi.boolean(),
});
const updateProductValidate = joi.object({
  id: joi.string().required(),
  name: joi.string().min(1).max(50),
  reelId: joi.string(),
  quntity: joi.number().min(0),
  price: joi.number(),
  colors: joi.array(),
  sizes: joi.array(),
  photos: joi.any(),
  promotion: joi.number(),
  description: joi.string(),
  status: joi.boolean(),
  showPrice: joi.boolean(),
  showPromotion: joi.boolean(),
});
const likeProductValidate = joi.object({
  idUser: joi.string().min(1).max(50),
  idProduct: joi.string(),
  video: joi.any().required(),
});
const commentProductValidate = joi.object({
  idUser: joi.string().required(),
  idProduct: joi.string().required(),
  toUserId: joi.string(),
});

module.exports = {
  addProductValidate,
  commentProductValidate,
  likeProductValidate,
  updateProductValidate,
};
