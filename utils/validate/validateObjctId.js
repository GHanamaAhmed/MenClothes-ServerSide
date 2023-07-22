const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

module.exports.objectId = Joi.string().custom((value, helper) => {
  return isValidObjectId(value) ? true : helper.message("Object id not valid!");
});
