"use strict"

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");

const db = require("../db.js");
const WatchList = require("./watchlist");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterAll,
  commonAfterEach
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** addMovie/getTitles */

describe("add movie and get titles", function () {
  test("works", async function () {
    await WatchList.addMovie("u1", "testId-1");
    const titles = await WatchList.getTitles("u1");
    expect(titles).toEqual([
      { id: "testId-1", title: "title-1", posterUrl: "http://c1.img" }
    ]);
  });

  test("bad request with duplicate title", async function () {
    try {
      await WatchList.addMovie("u1", "testId-1");
      await WatchList.addMovie("u1", "testId-1");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })
});

/************************************** removeTitle/getTitles */

describe("remove movie from watchlist", function () {
  test("works", async function () {
    await WatchList.addMovie("u1", "testId-1");
    await WatchList.addMovie("u1", "testId-2");
    let titles = await WatchList.getTitles("u1");
    expect(titles).toEqual([
      { id: "testId-1", title: "title-1", posterUrl: "http://c1.img" },
      { id: "testId-2", title: "title-2", posterUrl: "http://c2.img" }
    ]);
    await WatchList.removeTitle("u1", "testId-1");
    await WatchList.removeTitle("u1", "testId-2");
    titles = await WatchList.getTitles("u1");
    expect(titles).toEqual([]);
  });

  test("not found not in watchlist", async function () {
    try {
      await WatchList.removeTitle("u1", "testId-2");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

