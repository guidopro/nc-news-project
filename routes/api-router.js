const apiRouter = require("express").Router();
const {
  articlesRouter,
  commentsRouter,
  usersRouter,
  topicsRouter,
} = require("./index");
const endpointsJson = require("../endpoints.json");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

module.exports = apiRouter;
