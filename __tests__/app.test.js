const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("app general test", () => {
  test("404 - non-existant routes", () => {
      return request(app).get("/notaroute")
          .expect(404)
          .then(({ body: { msg } }) => {
              expect (msg).toBe('Error, path not found...')
          });
  });
});

describe("GET /api/topics", () => {
  test("responds with an array of topic objects, each with a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
