const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../db/app");
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
      .get("/api/article/1")
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
        expect(article).toHaveProperty("created_at", "2020-07-09 21:11:00");
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
});
