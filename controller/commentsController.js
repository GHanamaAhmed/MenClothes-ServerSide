const { default: mongoose } = require("mongoose");
const commentModel = require("../models/commentModel");
const {
  sendCommentValidate,
  getCommentValidate,
  getRepliesValidate,
} = require("../utils/validate/commentValidate");
const {
  fetchOneValidate,
  removeValidate,
} = require("../utils/validate/genralValidate");

module.exports.sendComment = async (req, res) => {
  const { error } = sendCommentValidate.validate(req.body);
  if (error) return res.status(401).send(error.message);
  const newComment = new commentModel({
    ...req.body,
    userId: req.user._id,
  });
  await newComment.save();
  res.status(200).send(newComment);
};

module.exports.getComments = async (req, res) => {
  const { error } = getCommentValidate.validate(req.query);
  if (error) return res.status(401).send(error.message);
  const { postId, type } = req.query;
  const comments = await commentModel.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
        type: type,
        toUserCommentId: { $exists: false },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { commentId: "$_id", userId: "$userId", createA: "$createAt" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$userId"],
              },
            },
          },
          {
            $unset: ["createAt", "clientId", "__v", "provider"],
          },
          {
            $addFields: {
              commentId: "$$commentId",
              createAt: "$$createA",
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $replaceRoot: {
        newRoot: "$user",
      },
    },
  ]);
  res.status(200).send(comments);
};

module.exports.getReples = async (req, res) => {
  const { error } = getRepliesValidate.validate(req.query);
  if (error) return res.status(401).send(error.message);
  const { postId, type, commentId } = req.query;
  const comments = await commentModel.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
        type: type,
        toUserCommentId: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: "users",
        let: { commentId: "$_id", userId: "$userId", createA: "$createAt" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$userId"],
              },
            },
          },
          {
            $unset: ["createAt", "clientId", "__v", "provider"],
          },
          {
            $addFields: {
              commentId: "$$commentId",
              createAt: "$$createA",
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $replaceRoot: {
        newRoot: "$user",
      },
    },
  ]);
  res.status(200).send(comments);
};

module.exports.deleteComment = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(401).send(error.message);
  const { id } = req.body;
  const comment = await commentModel.findById(id);
  if (!comment) return res.status(404).send("Comment dont found!");
  if (req.user.role == "admin") {
    await comment.deleteOne();
  } else {
    if (JSON.stringify(req.user._id) == JSON.stringify(comment.userId)) {
      await comment.deleteOne();
    } else {
      return res
        .status(400)
        .send("you dont have the right to delete this comment");
    }
  }
  const replies = await commentModel.deleteMany({
    toUserCommentId: comment._id,
  });
  res.status(200).json({ comment, replies });
};
