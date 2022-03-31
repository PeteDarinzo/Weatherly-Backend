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
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /:username */

describe("GET /:username", function () {
  test("works", async function () {
    const resp = await request(app)
      .get("/users/u1");
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

  test("not found for nonexistent user", async function () {
    const resp = await request(app)
      .get("/users/nonExistent");
    expect(resp.statusCode).toEqual(404);
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
      });

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
      });

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


  test("throws not found if no such user", async function () {
    const resp = await request(app)
      .patch("/users/nonexistent")
      .send({
        minTemp: 35,
        maxTemp: 85,
        drizzle: true,
        rain: true,
        snow: true
      });
    expect(resp.statusCode).toEqual(404);
  });

  test("throws bad request if bad data", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({});
    expect(resp.statusCode).toEqual(400);
  });
});
