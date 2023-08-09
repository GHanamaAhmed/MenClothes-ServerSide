const joi = require("joi");
const { objectId } = require("./validateObjctId");
let productsItem = joi.object().keys({
  name: joi.string().required(),
  price: joi.string().required(),
  id: objectId.required().required(),
  quntity: joi.number().required(),
  size: joi.string().required(),
  color: joi.string().required(),
  thumbanil: joi.string().required(),
});
const addOrderValidate = joi.object({
  userId: objectId,
  productsIds: joi.array().items(productsItem),
  coupon: joi.string(),
  adress: joi.string().required(),
  name: joi.string().required(),
  phone: joi.number().required(),
  city: joi.string().required(),
  photo: joi.string(),
});
const updateOrderValidate = joi.object({
  id: objectId.required(),
  userId: objectId,
  productsIds: joi.array().items(productsItem),
  coupon: joi.string(),
  adress: joi.string(),
  name: joi.string(),
  phone: joi.number(),
  city: joi.string(),
  photo: joi.string(),
  states: joi.string(),
});
module.exports = {
  addOrderValidate,
  updateOrderValidate
};
