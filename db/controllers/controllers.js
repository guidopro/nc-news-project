const { selectAllTopics, selectArticleById } = require("../models/models");

function getAllTopics(req, res) {
  selectAllTopics()
    .then((topics) => {
      return res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleById(req, res) {
  const id = req.params.article_id;

  selectArticleById(id)
    .then((article) => {
      return res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics, getArticleById };
