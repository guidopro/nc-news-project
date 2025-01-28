const {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertIntoCommentsByArticleId,
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
      next(err);
    });
}

function getAllArticles(req, res, next) {
  selectAllArticles()
    .then((articles) => {
      return res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(req, res, next) {
  const id = req.params.article_id;
  selectCommentsByArticleId(id)
    .then((comments) => {
      return res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(req, res, next) {
  const id = req.params.article_id;
  const newCommentObj = req.body;
  insertIntoCommentsByArticleId(id, newCommentObj)
    .then((postedComment) => {
      return res.status(201).send({ postedComment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
};
