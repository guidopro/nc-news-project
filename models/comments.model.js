const db = require("../db/connection");

function deleteCommentById(commentId) {
  return db
    .query(
      `DELETE FROM comments
        WHERE comment_id = $1`,
      [commentId]
    )
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject("Article does not exist");
      }
    });
}

function patchCommentById(id, { inc_votes }) {
  return db
    .query(
      `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Comment not found");
      }
      return rows[0];
    });
}

module.exports = {
  deleteCommentById,
  patchCommentById,
};
