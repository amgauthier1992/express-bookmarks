const app = require("../src/app");

describe("App", () => {
  it('GET /bookmarks responds with 200 containing an array of bookmarks', () => {
    return supertest(app).get("/bookmarks").expect(200, "Hello, boilerplate!");
  });
});
