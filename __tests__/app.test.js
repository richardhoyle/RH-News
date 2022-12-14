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
        expect(topics).toHaveLength(3);
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
  test("the articles array is in date decending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          decending: true,
          coerce: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns the article object with the correct properties when passed a valid article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: article }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("returns a 404 not found if the article number isn't valid", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('No article found for article_id 99')
    })
  });
  test("returns a 400 bad request if data type passed for article number is NaN", () => {
    return request(app)
    .get('/api/articles/banana')
    .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Bad Path')
      })
  })
});