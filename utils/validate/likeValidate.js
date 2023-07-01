const joi = require("joi");
const addLikeValidate = joi.object({
  userId: joi.string().required(),
  type: joi.string().valid("product","reel"),
  postId: joi.string().required(),
});
