const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const {
  getAllTopics,
  deleteComment,
  getAllUsers,
  getUser,
} = require("./controllers/controllers");
const endpointsJson = require("./endpoints.json");

apiRouter.use("/articles", articlesRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

apiRouter.get("/topics", getAllTopics);
apiRouter.delete("/comments/:comment_id", deleteComment);
apiRouter.get("/users", getAllUsers);
apiRouter.get("/users/:username", getUser);

module.exports = apiRouter;
