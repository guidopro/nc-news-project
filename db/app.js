const {
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/controllers");
const express = require("express");
const endpointsJson = require("../endpoints.json");
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err === "Article does not exist") {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "23503" && err.detail.includes("article_id")) {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "23503" && err.detail.includes("author")) {
    res.status(404).send({ msg: "Username does not exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err, "<------ err");
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
