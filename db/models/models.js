const db = require("../connection");

function selectAllTopics() {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
}

function selectArticleById(id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = { selectAllTopics, selectArticleById };
