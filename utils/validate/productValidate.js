const joi = require("joi");
const { objectId } = require("./validateObjctId");
const addProductValidate = joi.object({
  name: joi.string().max(100).required(),
  reelId: objectId,
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
  id: objectId.required(),
  name: joi.string().max(100),
  reelId: objectId,
  quntity: joi.number().min(0),
  price: joi.number(),
  colors: joi.array(),
  sizes: joi.array(),
  photos: joi.any(),
  thumbanil: joi.any().required(),
  promotion: joi.number(),
  description: joi.string(),
  status: joi.boolean(),
  showPrice: joi.boolean(),
  showPromotion: joi.boolean(),
});
const likeProductValidate = joi.object({
  idUser: objectId.required(),
  idProduct: objectId.required(),
});
const commentProductValidate = joi.object({
  idUser: objectId.required(),
  idProduct:objectId.required(),
  toUserId: objectId,
});

module.exports = {
  addProductValidate,
  commentProductValidate,
  likeProductValidate,
  updateProductValidate,
};
