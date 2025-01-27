const { selectAllTopics } = require("../models/models");

function getAllTopics(req, res) {
  selectAllTopics()
    .then((topics) => {
      return res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics };
