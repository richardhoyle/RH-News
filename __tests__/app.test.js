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
        expect(articles.length).toBe(12);
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
      .then(({ body: { article } }) => {
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
        expect(msg).toBe("No article found for article_id 99");
      });
  });
  test("returns a 400 bad request if data type passed for article number is NaN", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns an array of comments for a passed article_id, each comment having the correct properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              comment_id: expect.any(Number),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("returns a 200 and an empty array when an article_id is valid but there are no comments associated with that article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
  test("returns a 404 not found if the article number isn't valid", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("No article found for article_id 99");
      });
  });
  test("returns a 400 bad request if data type passed for article number is NaN whilst getting relevent comments", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
  test("returns a 404 bad request if a word other than comments is used after article number", () => {
    return request(app)
      .get("/api/articles/9/bananas")
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Error, path not found...");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("creates and adds a new comment with username and body to the database", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Superb article, thumbs up from me!",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            article_id: 9,
            author: "butter_bridge",
            body: "Superb article, thumbs up from me!",
            votes: 0,
          })
        );
      });
  });
  test("does not add a new comment when given an invalid artile id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Superb article, thumbs up from me!",
    };
    return request(app)
      .post("/api/articles/99/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const comment = response.body.comment;
        const msg = response.body.msg;
        expect(comment).toEqual(
          expect.not.objectContaining({
            author: "butter_bridge",
            body: "Superb article, thumbs up from me!",
          })
        );
        expect(msg).toBe("No article found for article_id 99");
      });
  });

  test("returns a 400 bad request if data type passed for article number is NaN whilst POSTING a new comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Superb article, thumbs up from me!",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("updates inc_votes by the number passed", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 3 })
      .expect(201)
      .then((response) => {
        expect(response.body).toBe(response.body);
        expect(response.body.article[0].votes).toBe(103);
      });
  });
  test("doesnt update votes when article_id doesnt exist", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 2 })
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("No article found for article_id 99");
      });
  });
});
