const { getAllTopics, postTopic } = require("../controllers/controllers");
const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getAllTopics).post(postTopic);

module.exports = topicsRouter;
