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
      if (result.rows.length === 0) {
        return Promise.reject("article does not exist");
      } else return result.rows[0];
    });
}

function selectAllArticles() {
  return db.query("SELECT * FROM articles").then((result) => {
    return result.rows;
  });
}

module.exports = { selectAllTopics, selectArticleById, selectAllArticles };
