const { getAllTopics, postTopic } = require("../controllers/topics.controller");
const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getAllTopics).post(postTopic);

module.exports = topicsRouter;
