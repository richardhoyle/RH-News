const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const topics = require("../db/data/test-data/topics.js");
afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("app general test", () => {
  test("404 - non-existant routes", () => {
    return request(app)
      .get("/notaroute")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Error, path not found...");
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
          expect(topics).toHaveLength(3)
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

describe("GET /api/articles", () => {
  test("responds with an array of article objects with various properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
