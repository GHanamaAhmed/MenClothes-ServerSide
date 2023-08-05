const joi = require("joi");
const { objectId } = require("./validateObjctId");
const details = joi.object().keys({
  sizes: joi.array().required(),
  color: joi.string().required(),
  quntity: joi.number().required(),
  nPhotos: joi.number().required(),
});
const addProductValidate = joi.object({
  name: joi.string().max(100).required(),
  reelId: objectId,
  quntity: joi.number().min(0),
  price: joi.number().required(),
  details: joi.array().items(details),
  photos: joi.any(),
  thumbanil: joi.any(),
  promotion: joi.number(),
  type: joi.string(),
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
  details: joi.array().items(details),
  photos: joi.any(),
  thumbanil: joi.any(),
  promotion: joi.number(),
  type: joi.string(),
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
  idProduct: objectId.required(),
  toUserId: objectId,
});

module.exports = {
  addProductValidate,
  commentProductValidate,
  likeProductValidate,
  updateProductValidate,
};
