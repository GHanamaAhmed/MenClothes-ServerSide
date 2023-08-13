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
  try {
    const { error } = sendCommentValidate.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const newComment = new commentModel({
      ...req.body,
      userId: req.user._id,
    });
    await newComment.save();
    res.status(200).send(newComment);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const { error } = getCommentValidate.validate(req.query);
    if (error) return res.status(404).send(error.message);
    const { postId, type } = req.query;
    console.log(req.query);
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
          let: {
            commentId: "$_id",
            userId: "$userId",
            createA: "$createAt",
            text: "$text",
          },
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
                text: "$$text",
              },
            },
          ],
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { commentId: "$commentId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$toUserCommentId", "$$commentId"],
                },
              },
            },
          ],
          as: "replies",
        },
      },
      {
        $addFields: {
          replies: { $size: "$replies" },
        },
      },
    ]);
    res.status(200).send(comments);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.getCountComment = async (req, res) => {
  try {
    const { error } = getCommentValidate.validate(req.query);
    if (error) return res.status(404).send(error.message);
    const { postId, type } = req.query;
    console.log(req.query);
    const comments = await commentModel.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          type: type,
        },
      },
      {
        $count: "count",
      },
    ]);
    res.status(200).send(comments);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.getReples = async (req, res) => {
  try {
    const { error } = getRepliesValidate.validate(req.query);
    if (error) return res.status(400).send(error.message);
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
          let: {
            commentId: "$_id",
            userId: "$userId",
            createA: "$createAt",
            text: "$text",
          },
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
                text: "$$text",
              },
            },
          ],
          as: "user",
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { commentId: "$commentId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$toUserCommentId", "$$commentId"],
                },
              },
            },
          ],
          as: "replies",
        },
      },
      {
        $addFields: {
          replies: { $size: "$replies" },
        },
      },
    ]);
    res.status(200).send(comments);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const { error } = removeValidate.validate(req.body);
    if (error) return res.status(400).send(error.message);
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
    let replies = [comment];
    let n = replies.length;
    let i = 0;
    while (i < n) {
      let element = await commentModel.findOneAndDelete({
        toUserCommentId: replies[i]._id,
      });
      element && replies.push(element);
      n = replies.length;
      i++;
    }

    res.status(200).json({ comment, replies });
  } catch (e) {
    res.status(400).send(e);
  }
};
