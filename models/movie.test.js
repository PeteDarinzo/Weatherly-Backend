"use strict"

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");

const db = require("../db.js");
const Movie = require("./movie");

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

/************************************** create */

describe("create", function () {
  const newMovie = {
    id: "testId",
    title: "testTitle",
    posterUrl: "http://c1.img"
  }

  test("works", async function () {
    let movie = await Movie.create(newMovie);
    expect(movie[0]).toEqual(newMovie);
  });
});