const request = require("supertest");
const app = require("../db/app");
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
  test("should respond with an array of topics, each with a slug and description property", () => {
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
  test("should respond with requested article", () => {
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
  test("should respond with a status 404 when article id is not listed on the db", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("responds with a status 400 when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("should return all the articles from the db", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
      });
  });
  test("objects should all have author, title, article_id, topic, created_at, votes, article_img_url, comment_count properties,", () => {
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
  test("all objects should not have body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("should be sorted in descending order by date", () => {
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
  test("should return an array of comments for the given article_id ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
      });
  });
  test("each comment should have comment_id, votes, created_at, author, body and article_id properties", () => {
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
  test("array should be sorted by most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("responds with a status 400 when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should respond with a status 404 when article id is not listed on the db", () => {
    return request(app)
      .get("/api/articles/4357953/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
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
  test("should update an article by article_id and respond with the updated article", () => {
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
  test("should increment votes when votes does not already equal zero", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 153 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle.votes).toBe(253);
      });
  });
  test("should decrement votes when votes does not already equal zero", () => {
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
    return request(app).delete("/api/comments/8").expect(204);
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

describe("CORE: GET /api/users", () => {
  test("should return an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
      });
  });
  test("objects in returned array should all have username, name & avatar_url properties", () => {
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

describe("CORE: GET /api/articles (sorting queries)", () => {
  test("should accept a sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        console.log(articles);

        expect(articles).toBeSortedBy("article_id");
      });
  });
  test("should accept a sort_by and order query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { ascending: true });
      });
  });
  test("404 should send error if column to sort_by does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=column-does-not-exist?order=asc")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Column not found");
      });
  });
});
