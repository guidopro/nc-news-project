const { getAllUsers, getUser } = require("../controllers/users.controller");
const usersRouter = require("express").Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUser);

module.exports = usersRouter;
