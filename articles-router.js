const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  patchArticle,
  postCommentByArticleId,
  postArticle,
  deleteArticle
} = require("./controllers/controllers");
const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postArticle);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle).delete(deleteArticle)

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
