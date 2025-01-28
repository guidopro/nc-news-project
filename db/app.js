const express = require("express");
const app = express();
const endpointsJson = require("../endpoints.json");
const {
  getAllTopics,
  getArticleById,
  getAllArticles,
} = require("./controllers/controllers");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err === "article does not exist") {
    res.status(404).send({ msg: "article does not exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
