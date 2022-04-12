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

/************************************** GET users/:username */

describe("GET /:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get("/users/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      user:
      {
        username: "u1",
        postalCode: "00001",
        lat: "0",
        lon: "0",
        city: "test-city",
        countryCode: "US",
        maxTemp: null,
        minTemp: null,
        units: "imperial",
        thunderstorm: false,
        drizzle: false,
        rain: false,
        snow: false,
        overcast: false
      }
    })
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get("/users/u1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST users/:username */

describe("POST /:username/movies", function () {

  test("adds a movie to a user's list", async function () {
    const resp = await request(app)
      .post("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      movie: {
        username: "u1",
        movieid: "testId-1"
      }
    });
  });

  test("can't add movie to another user's list", async function () {
    const resp = await request(app)
      .post("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** PATCH /:username */

describe("PATCH /:username", function () {
  test("updates user location", async function () {
    const locationData = {
      data: {
        lat: "00.01",
        lon: "00.01",
        name: "newTestCity"
      }
    };

    // mock the /Get call to the OpenWeatherAPI with test location data
    axios.get.mockResolvedValueOnce(locationData);

    const resp = await request(app)
      .patch("/users/u1")
      .send({
        postalCode: "00002",
        countryCode: "US",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      user: {
        username: "u1",
        postalCode: "00002",
        lat: "00.01",
        lon: "00.01",
        city: "newTestCity",
        countryCode: "US",
        maxTemp: null,
        minTemp: null,
        units: "imperial",
        thunderstorm: false,
        drizzle: false,
        rain: false,
        snow: false,
        overcast: false
      }
    });
  });

  test("updates user weather preferences", async function () {

    const resp = await request(app)
      .patch("/users/u1")
      .send({
        minTemp: 35,
        maxTemp: 85,
        drizzle: true,
        rain: true,
        snow: true
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      user: {
        username: "u1",
        postalCode: "00001",
        lat: "0",
        lon: "0",
        city: "test-city",
        countryCode: "US",
        maxTemp: 85,
        minTemp: 35,
        units: "imperial",
        thunderstorm: false,
        drizzle: true,
        rain: true,
        snow: true,
        overcast: false
      }
    });
  });

  test("throws bad request if bad data", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({})
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth for different user", async function () {

    const resp = await request(app)
      .patch("/users/u1")
      .send({
        minTemp: 35,
        maxTemp: 85,
        drizzle: true,
        rain: true,
        snow: true
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(resp.statusCode).toEqual(401);
  });
});


/************************************** DELETE /users/:username/movies */

describe("DELETE /:username/movies", function () {

  test("removes a movie from a user's list", async function () {
    const addResp = await request(app)
      .post("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(addResp.statusCode).toEqual(201);

    const deleteResp = await request(app)
      .delete("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(deleteResp.body).toEqual({
      deleted: "testId-1"
    });
  });

  test("can't add a  movie to another user's list", async function () {
    const resp = await request(app)
      .post("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("can't delete a movie to another user's list", async function () {
    const addResp = await request(app)
      .post("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(addResp.statusCode).toEqual(201);

    const deleteResp = await request(app)
      .delete("/users/u1/movies")
      .send({
        movieId: "testId-1"
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(deleteResp.statusCode).toEqual(401);
  });
});