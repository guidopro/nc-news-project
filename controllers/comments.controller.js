const {
  patchCommentById,
  deleteCommentById,
} = require("../models/comments.model");

function deleteComment(req, res, next) {
  const commentId = req.params.comment_id;
  deleteCommentById(commentId)
    .then(() => {
      return res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

function patchComment(req, res, next) {
  const comment_id = req.params.comment_id;
  const newVote = req.body;
  patchCommentById(comment_id, newVote)
    .then((updatedComment) => {
      return res.status(200).send({ updatedComment: updatedComment });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { deleteComment, patchComment };
