const db = require("../db/connection");
const format = require("pg-format");
const checkExists = require("../utils/utils");

function selectAllTopics() {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
}

function selectArticleById(id) {
  return db
    .query(
      `SELECT articles.body, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
        JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject("Article does not exist");
      } else return result.rows[0];
    });
}

function selectAllArticles(queries) {
  const sort_by = queries.sort_by;
  const order = queries.order;
  const topic = queries.topic;

  const allowedSortByInputs = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const allowedOrderInputs = ["asc", "ASC", "desc", "DESC"];

  let SQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;
  let args = [];

  if (topic) {
    SQLString += ` WHERE topic = $1`;
    args.push(topic);
  }
  SQLString += ` GROUP BY articles.article_id`;

  if (!allowedSortByInputs.includes(sort_by) && sort_by !== undefined) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  if (sort_by) {
    SQLString += ` ORDER BY %I`;
  } else {
    SQLString += ` ORDER BY articles.created_at`;
  }

  if (!allowedOrderInputs.includes(order) && order !== undefined) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  if (order) {
    SQLString += ` %s`;
  } else {
    SQLString += ` DESC`;
  }

  const queryStr = format(SQLString, sort_by, order);

  return db.query(queryStr, args).then(async ({ rows }) => {
    if (!rows.length) {
      const validTopic = await checkExists("topics", "slug", topic);
      if (!validTopic) {
        return Promise.reject({ status: 404, msg: "Category not found" });
      }
    }
    return rows;
  });
}

function selectCommentsByArticleId(id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject("Article does not exist");
      } else return result.rows;
    });
}

function insertIntoCommentsByArticleId(id, { username, body }) {
  return db
    .query(
      `INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [body, id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function patchArticleById(id, { inc_votes }) {
  return db
    .query(
      `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Article does not exist");
      }
      return rows[0];
    });
}

function deleteCommentById(commentId) {
  return db
    .query(
      `DELETE FROM comments
        WHERE comment_id = $1`,
      [commentId]
    )
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject("Article does not exist");
      }
    });
}

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

function patchCommentById(id, { inc_votes }) {
  return db
    .query(
      `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Comment not found");
      }
      return rows[0];
    });
}

function addNewArticle({ title, topic, author, body, article_img_url }) {
  if (!title || !topic || !author || !body) {
    return Promise.reject("Missing data on request object");
  }

  let result;
  if (!article_img_url) {
    result = db.query(
      `INSERT INTO articles (title, topic, author, body)
    VALUES ($1, $2, $3, $4) RETURNING article_id`,
      [title, topic, author, body]
    );
  } else {
    result = db.query(
      `INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5) RETURNING article_id`,
      [title, topic, author, body, article_img_url]
    );
  }

  return result
    .then(({ rows }) => {
      if (!rows) {
        return Promise.reject("Bad request");
      }
      const article_id = rows[0].article_id;
      return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  selectAllTopics,
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertIntoCommentsByArticleId,
  patchArticleById,
  deleteCommentById,
  selectAllUsers,
  selectUser,
  patchCommentById,
  addNewArticle,
};
