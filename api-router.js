const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from /api");
})