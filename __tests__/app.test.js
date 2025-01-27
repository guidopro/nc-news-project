const endpointsJson = require("../endpoints.json");

const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")



beforeEach(() => seed(testData));
afterAll(() => db.end());

describe.skip("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
