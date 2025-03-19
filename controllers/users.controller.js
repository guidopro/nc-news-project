const { selectUser, selectAllUsers } = require("../models/users.model");

function getUser(req, res, next) {
  const username = req.params.username;
  selectUser(username)
    .then((user) => {
      return res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllUsers(req, res, next) {
  selectAllUsers()
    .then((users) => {
      return res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getUser, getAllUsers };
