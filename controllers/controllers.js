const {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertIntoCommentsByArticleId,
  patchArticleById,
  deleteCommentById,
  selectAllUsers,
  selectUser,
  patchCommentById,
  addNewArticle,
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

function getAllUsers(req, res, next) {
  selectAllUsers()
    .then((users) => {
      return res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
}

function getUser(req, res, next) {
  const username = req.params.username;
  selectUser(username)
    .then((user) => {
      return res.status(200).send({ user: user });
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

module.exports = {
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticle,
  deleteComment,
  getAllUsers,
  getUser,
  patchComment,
  postArticle,
};
