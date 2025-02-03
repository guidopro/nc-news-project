const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const endpointsJson = require("./endpoints.json");

apiRouter.use("/articles", articlesRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

module.exports = apiRouter;
