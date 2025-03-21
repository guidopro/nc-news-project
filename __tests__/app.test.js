const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: should respond with an array of topics, each with a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
        expect(topics).toEqual(testData.topicData);
        // not sure if this is a good assertion as it will fail when the db changes
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with requested article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty(
          "created_at",
          "2020-07-09T20:11:00.000Z"
        );
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("200: An article response object should also now include a comment_count property", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count");
        expect(article.comment_count).toBe("2");
      });
  });
  test("400: responds with a status 400 when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with a status 404 when article id is not listed on the db", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return all the articles from the db", () => {
    return request(app)
      .get("/api/articles?limit=")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
      });
  });
  test("200: objects should all have author, title, article_id, topic, created_at, votes, article_img_url, comment_count properties,", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("200: all objects should not have body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: should be sorted in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return an array of comments for the given article_id with properties: comment_id, votes, created_at, author, body and article_id ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("200 array should be sorted by most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200 should be limited to no more than 10 by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
      });
  });
  test("200 should take a limit query (queries) ", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(5);
      });
  });
  test("200 should take an offset/p query (queries) ", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(1);
      });
  });
  test("400 responds with a status 400 when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400 should respond with error when given invalid limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=notalimit")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400 should respond with error when given invalid p query", () => {
    return request(app)
      .get("/api/articles/1/comments?p=notapage")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404 should respond with a status 404 when article id is not listed on the db", () => {
    return request(app)
      .get("/api/articles/4357953/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("404 should respond with 404 if offset is a higher value than the existing data", () => {
    return request(app)
      .get("/api/articles/1/comments?p=3")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comments not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201 should insert a new comment to the db and send it back to client ", () => {
    const newComment = {
      username: "lurker",
      body: "Tra la la la Tra la la la. Tra la la",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { postedComment } }) => {
        expect(postedComment.body).toBe("Tra la la la Tra la la la. Tra la la");
        expect(postedComment.author).toBe("lurker");
        expect(postedComment.article_id).toBe(2);
        expect(postedComment).toHaveProperty("comment_id");
        expect(postedComment).toHaveProperty("votes");
        expect(postedComment).toHaveProperty("created_at");
      });
  });
  test("400 responds with an error message when provided with a bad request (does not contain username or body)", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        wrongProperty: "gone wrong",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("400 sends an error message when given an invalid id", () => {
    const newComment = {
      username: "rogersop",
      body: "nada",
    };
    return request(app)
      .post("/api/articles/not-an-article-id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    const newComment = {
      username: "rogersop",
      body: "zero",
    };
    return request(app)
      .post("/api/articles/4357953/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("404 responds with an error message when provided with a username which does not exist", () => {
    const newComment = {
      username: "costa del sol",
      body: "hang loose",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Username does not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200 should update an article by article_id and respond with the updated article", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle.votes).toBe(1);

        expect(updatedArticle).toHaveProperty("article_id", 7);
        expect(updatedArticle).toHaveProperty("body", "I was hungry.");
        expect(updatedArticle).toHaveProperty("author", "icellusedkars");
        expect(updatedArticle).toHaveProperty("title", "Z");
        expect(updatedArticle).toHaveProperty("topic", "mitch");
        expect(updatedArticle).toHaveProperty("created_at");
        expect(updatedArticle).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("200 should increment votes when votes does not already equal zero", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 153 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle.votes).toBe(253);
      });
  });
  test("200 should decrement votes when votes does not already equal zero", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle.votes).toBe(50);
      });
  });
  test("400 sends an error message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/not-a-valid-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400 sends an error message when given bad data", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ bad_data: null })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400 sends an error message when given wrong data type ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: ["100"] })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404 sends an error message when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/5353")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article does not exist");
      });
  });
  test("404 sends an error message when article_id is too big a datatype for SQL to handle", () => {
    return request(app)
      .patch("/api/articles/535334587345983479")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204 should delete given comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments WHERE article_id = 9");
      })
      .then((res) => {
        expect(res.rows.length).toBe(1);
      });
  });
  test("400 responds with error message when given invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404 responds with error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("GET /api/users", () => {
  test("200 should return an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
      });
  });
  test("200 objects in returned array should all have username, name & avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200 should accept a sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200 should accept (title) column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200 should accept (topic) column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("200 should accept (author) column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200 should accept (votes) column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200 should accept (article_img_url) column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_img_url", { descending: true });
      });
  });
  test("200 should accept (comment_count) column to sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("comment_count", {
          descending: true,
          coerce: true,
        });
      });
  });

  test("200 should accept a sort_by and order query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id");
      });
  });

  test("200 order query should work on its own", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });

  test("400 should send error if column to sort_by does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=column-does-not-exist&order=asc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400 should send error if order query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=not-a-valid-order")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200 should respond with all articles that match the topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(1);
      });
  });
  test("200 should respond with an empty array if topic exists but no rows exist with that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("404 should respond with error when given an invalid value", () => {
    return request(app)
      .get("/api/articles?topic=not-a-valid-value")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Category not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200 should return a user object with username, avatar_url & name properties", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("404 should return error when username does not exist", () => {
    return request(app)
      .get("/api/users/username-does-not-exist")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200 should return an updated comment", () => {
    return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: 7 })
      .expect(200)
      .then(({ body: { updatedComment } }) => {
        expect(updatedComment.votes).toBe(7);
      });
  });
  test("200 should increment votes when votes does not already equal zero", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: { updatedComment } }) => {
        expect(updatedComment.votes).toBe(26);
      });
  });
  test("400 sends an error message when given an invalid id", () => {
    return request(app)
      .patch("/api/comments/not-a-valid-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400 sends an error message when given wrong data type ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: ["100"] })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404 should return an error if comment_id does not exist", () => {
    return request(app)
      .patch("/api/comments/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("201 should respond with a newly added article as an object with the correct properties", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "seventh heaven",
        body: "I miss sector 7 slums",
        topic: "cats",
        article_img_url:
          "https://www.pexels.com/photo/cicek-ayasofya-15047434/",
      })
      .expect(201)
      .then(({ body: { newArticle } }) => {
        expect(newArticle).toHaveProperty("article_id");
        expect(newArticle).toHaveProperty("votes");
        expect(newArticle).toHaveProperty("created_at");
        expect(newArticle).toHaveProperty("comment_count");
        expect(newArticle).toHaveProperty("author", "icellusedkars");
        expect(newArticle).toHaveProperty("title", "seventh heaven");
        expect(newArticle).toHaveProperty("body", "I miss sector 7 slums");
        expect(newArticle).toHaveProperty("topic", "cats");
        expect(newArticle).toHaveProperty(
          "article_img_url",
          "https://www.pexels.com/photo/cicek-ayasofya-15047434/"
        );
      });
  });
  test("201 should respond with a new article when article_img_url not given", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "rogersop",
        title: "nibelheim",
        body: "a small mountain village located at the base of Mt. Nibel",
        topic: "mitch",
      })
      .expect(201)
      .then(({ body: { newArticle } }) => {
        expect(newArticle).toHaveProperty("article_id");
        expect(newArticle).toHaveProperty("votes");
        expect(newArticle).toHaveProperty("created_at");
        expect(newArticle).toHaveProperty("comment_count");
        expect(newArticle).toHaveProperty("author", "rogersop");
        expect(newArticle).toHaveProperty("title", "nibelheim");
        expect(newArticle).toHaveProperty(
          "body",
          "a small mountain village located at the base of Mt. Nibel"
        );
        expect(newArticle).toHaveProperty("topic", "mitch");
        expect(newArticle).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
      });
  });
  test("400 should respond with an error if data is missing from request body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "seventh heaven",
        // missing body property
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing data on request object");
      });
  });
  test("404 should return an error when author not found ", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "does not exist",
        title: "seventh heaven",
        body: "hello",
        topic: "cats",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username does not exist");
      });
  });
  test("404 should return an error when topic not found", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "seventh heaven",
        body: "hello",
        topic: "not a topic",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles (pagination)", () => {
  test("200 should return only 10 articles", () => {
    return request(app)
      .get("/api/articles?limit=10")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  test("200 should return only 10 articles by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  test("200 should have total_count property, displaying the total number of articles discounting the limit", () => {
    return request(app)
      .get("/api/articles?topic=mitch&p=1&limit=10")
      .expect(200)
      .then(({ body: { total_count } }) => {
        expect(total_count).toBe(12);
      });
  });
  test("200 should display the remainder of articles on 2nd page", () => {
    return request(app)
      .get("/api/articles?topic=mitch&p=2&limit=10")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(2);
      });
  });
  test("200 should be able to handle pagination with full query line", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&sort_by=article_id&order=desc&limit=5&p=2"
      )
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200 should return emoty array when given page number bigger than results", () => {
    return request(app)
      .get("/api/articles?p=3")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("400 should return error when given wrong data for limit", () => {
    return request(app)
      .get("/api/articles?limit=notanumber")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("400 should return error when given wrong data for page", () => {
    return request(app)
      .get("/api/articles?p=notanumber")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/topics", () => {
  test("201 Responds with a topic object containing the newly added topic.", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "test topic",
        description: "description here",
      })
      .expect(201)
      .then(({ body: { newTopic } }) => {
        expect(newTopic).toEqual({
          slug: "test topic",
          description: "description here",
        });
      });
  });
  test("400 should respond with an error if request body missing correct properties", () => {
    return request(app)
      .post("/api/topics")
      .send({
        wrongSlug: "abcd",
        wrongDescription: "efg",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204 should delete article and its respective comments", () => {
    return request(app)
      .delete("/api/articles/3")
      .expect(204)
      .then(() => {
        return db
          .query("SELECT * FROM comments WHERE article_id = 3")
          .then(({ rows }) => {
            expect(rows.length).toBe(0);
            return db
              .query("SELECT * FROM articles WHERE article_id = 3")
              .then(({ rows }) => {
                expect(rows.length).toBe(0);
              });
          });
      });
  });
  test("400 responds with error message when given invalid id", () => {
    return request(app)
      .delete("/api/articles/not-a-valid-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404 responds with error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/articles/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});
