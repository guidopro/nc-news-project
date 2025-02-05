const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  patchArticle,
  postCommentByArticleId,
  postArticle,
} = require("./controllers/controllers");
const articlesRouter = require("express").Router();

// articlesRouter.get("/", getAllArticles);
articlesRouter.route("/").get(getAllArticles).post(postArticle)
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
