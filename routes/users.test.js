"use strict"

const request = require("supertest");

const app = require("../app");

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
        conditions: null,
        units: "imperial"
      }
    })
  });

  test("not found for nonexistent user", async function () {
    const resp = await request(app)
      .get("/users/nonExistent");
    expect(resp.statusCode).toEqual(404);
  });

});