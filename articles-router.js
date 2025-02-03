const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
} = require("./controllers/controllers");
const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

module.exports = articlesRouter;
