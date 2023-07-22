const joi = require("joi");
const { objectId } = require("./validateObjctId");
const handleLikeValidate = joi.object({
  type: joi.string().valid("product", "reel").required(),
  postId: objectId.required(),
});
const fetchLikeValidate = joi.object({
  id: objectId.required(),
  type: joi.string().valid("product", "reel").required(),
  min: joi.number(),
  max: joi.number(),
});
module.exports = { handleLikeValidate, fetchLikeValidate };
