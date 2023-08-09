const joi = require("joi");
const { objectId } = require("./validateObjctId");
const postCaodeValidate = joi.object({
  porcent: joi.number().max(100),
  price: joi.string(),
  code: joi.string().required(),
  max: joi.number().required(),
  expireAt: joi.number(),
});
const fetchCaodeValidate = joi.object({
  max: joi.number().max(100),
  min: joi.string(),
  expire: joi.number(),
  used: joi.boolean(),
  reverse: joi.boolean(),
  name: joi.string(),
});
const getRepliesValidate = joi.object({
  type: joi.string().valid("product", "reel").required(),
  postId: objectId.required(),
  commentId: objectId.required(),
});
const getCommentValidate = joi.object({
  type: joi.string().valid("product", "reel").required(),
  postId: objectId.required(),
});
module.exports = {
    fetchCaodeValidate,
  postCaodeValidate,
};
