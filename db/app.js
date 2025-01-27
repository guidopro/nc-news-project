const express = require("express");
const app = express();
const endpointsJson = require("../endpoints.json");
const { getAllTopics } = require("./controllers/controllers");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

module.exports = app;
