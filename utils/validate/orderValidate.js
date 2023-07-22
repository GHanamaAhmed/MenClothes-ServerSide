const joi = require("joi");
const { objectId } = require("./validateObjctId");
let productsItem = joi.object().keys({
  id: objectId.required(),
  quntity: joi.number().default(1),
});
const addOrderValidate = joi.object({
  userId: objectId.required(),
  productsIds: joi.array().items(productsItem),
});
