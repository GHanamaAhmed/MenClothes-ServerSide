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
  adress: joi.string().required().messages({
    "any.required": `يجب ادخال العنوان`,
  }),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": `يجب ادخال الايميل`,
    }),
  name: joi.string().required().messages({
    "any.required": `يجب ادخال الاسم`,
  }),
  phone: joi.number().required().messages({
    "any.required": `يجب ادخال رقم الهاتف`,
  }),
  city: joi.string().required().messages({
    "any.required": `يجب ادخال المدينة`,
  }),
  delivery: joi
    .string()
    .valid("deleveryAgency", "homeDelivery")
    .required()
    .messages({
      "any.required": `يجب عليك اختيار طريقة التوصيل`,
    }),
  photo: joi.string(),
  shipping: joi.number(),
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
  shipping: joi.number(),
});
module.exports = {
  addOrderValidate,
  updateOrderValidate,
};
