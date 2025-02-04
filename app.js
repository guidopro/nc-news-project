const express = require("express");
const app = express();
const apiRouter = require("./api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err === "Article does not exist" || err.code === "22003") {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "23503" && err.detail.includes("article_id")) {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "23503" && err.detail.includes("author")) {
    res.status(404).send({ msg: "Username does not exist" });
  } else if (err.status === 404 && err.msg === "Invalid Input") {
    res.status(err.status).send({ msg: err.msg });
  } else if (err === "User not found") {
    res.status(404).send({ msg: "User not found" });
  } else next(err);
});

// custom error & 500 error handler

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err, "<------ err");
    res.status(500).send({ msg: "Server Error!" });
  }
});

module.exports = app;
