const joi = require("joi");
const { objectId } = require("./validateObjctId");
const sendCommentValidate = joi.object({
  toUserCommentId: objectId,
  type: joi.string().valid("product", "reel").required(),
  postId: objectId.required(),
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
module.exports = { sendCommentValidate, getCommentValidate,getRepliesValidate };
