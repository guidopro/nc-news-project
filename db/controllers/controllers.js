const {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
} = require("../models/models");

function getAllTopics(req, res, next) {
  selectAllTopics()
    .then((topics) => {
      return res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleById(req, res, next) {
  const id = req.params.article_id;

  selectArticleById(id)
    .then((article) => {
      return res.status(200).send({ article: article });
    })
    .catch((err) => {
      console.log(err);

      next(err);
    });
}

function getAllArticles(req, res, next) {
  selectAllArticles()
    .then((articles) => {
      return res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      console.log(err);

      next(err);
    });
}

module.exports = { getAllTopics, getArticleById, getAllArticles };
