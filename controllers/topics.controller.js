const { selectAllTopics, addTopic } = require("../models/topics.model");

function getAllTopics(req, res, next) {
  selectAllTopics()
    .then((topics) => {
      return res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}

function postTopic(req, res, next) {
  const { slug, description } = req.body;
  addTopic(slug, description)
    .then((newTopic) => {
      return res.status(201).send({ newTopic: newTopic });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllTopics,
  postTopic,
};
