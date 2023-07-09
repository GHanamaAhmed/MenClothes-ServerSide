const joi = require("joi");
const handleLikeValidate = joi.object({
  type: joi.string().valid("product", "reel").required(),
  postId: joi.string().required(),
});
const fetchLikeValidate = joi.object({
  id: joi.string().required(),
  type: joi.string().valid("product", "reel").required(),
  min: joi.number(),
  max: joi.number(),
});
module.exports = { handleLikeValidate, fetchLikeValidate };
