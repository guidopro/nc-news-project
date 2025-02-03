const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  patchArticle,
  postCommentByArticleId,
} = require("./controllers/controllers");
const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
