const {
  selectArticleById,
  selectAllArticles,
  patchArticleById,
  addNewArticle,
  removeArticleAndComments,
  selectCommentsByArticleId,
  insertIntoCommentsByArticleId,
} = require("../models/articles.model");

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
  const { sort_by, order, topic, p, limit } = req.query;

  selectAllArticles(sort_by, order, topic, p, limit)
    .then((articles) => {
      return res
        .status(200)
        .send({ articles: articles.rows, total_count: articles.totalCount });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleId(req, res, next) {
  const id = req.params.article_id;
  const { p, limit } = req.query;
  selectCommentsByArticleId(id, p, limit)
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

function patchArticle(req, res, next) {
  const id = req.params.article_id;
  const newVote = req.body;
  patchArticleById(id, newVote)
    .then((updatedArticle) => {
      return res.status(200).send({ updatedArticle: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next) {
  const articleRequest = req.body;

  addNewArticle(articleRequest)
    .then((newArticle) => {
      return res.status(201).send({ newArticle: newArticle });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteArticle(req, res, next) {
  const article_id = req.params.article_id;
  removeArticleAndComments(article_id)
    .then(() => {
      return res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getAllArticles,
  patchArticle,
  postArticle,
  deleteArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
};
