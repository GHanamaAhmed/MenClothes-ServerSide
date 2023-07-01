const joi = require("joi");
let productsItem = joi.object().keys({
  id: joi.string().required(),
  quntity: joi.number().default(1),
});
const addOrderValidate = joi.object({
  userId: joi.string().required(),
  productsIds: joi.array().items(productsItem),
});
