"use strict"

const request = require("supertest");
const axios = require("axios");

const app = require("../app");

jest.mock("axios");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");
const { set } = require("../app");
const req = require("express/lib/request");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** POST movies/save */

describe("POST /movies/save", function () {


  test("adds a movie to the database", async function () {
    const resp = await request(app)
      .post("/movies/save")
      .send({
        id: "newMovieId",
        title: "newTitle",
        posterUrl: "http://newMovie.img"
      })
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      movie: {
        id: "newMovieId",
        title: "newTitle",
        posterUrl: "http://newMovie.img"
      }
    });
  });

  test("no error for a duplicate movie", async function () {
    await request(app)
      .post("/movies/save")
      .send({
        id: "newMovieId",
        title: "newTitle",
        posterUrl: "http://newMovie.img"
      });
    const resp = await request(app)
      .post("/movies/save")
      .send({
        id: "newMovieId",
        title: "newTitle",
        posterUrl: "http://newMovie.img"
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      msg: "Movie already exists."
    });
  });

});