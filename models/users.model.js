const db = require("../db/connection");

function selectAllUsers() {
  return db.query(`SELECT * from users`).then(({ rows }) => {
    return rows;
  });
}

function selectUser(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("User not found");
      }
      return rows[0];
    });
}

module.exports = { selectAllUsers, selectUser };
