const { selectAllTopics } = require("../models/models");

function getAllTopics(req, res) {
  selectAllTopics().then((topics) => {
    // console.log(topics);

    return res.status(200).send({ topics: topics });
  });
}

module.exports = { getAllTopics };
