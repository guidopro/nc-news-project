const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const {
  getAllTopics,
  deleteComment,
  getAllUsers,
  getUser,
  patchComment,
  postTopic
} = require("./controllers/controllers");
const endpointsJson = require("./endpoints.json");

apiRouter.use("/articles", articlesRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

apiRouter.route("/topics").get(getAllTopics).post(postTopic)
apiRouter.patch("/comments/:comment_id", patchComment);
apiRouter.delete("/comments/:comment_id", deleteComment);
apiRouter.get("/users", getAllUsers);
apiRouter.get("/users/:username", getUser);

module.exports = apiRouter;
