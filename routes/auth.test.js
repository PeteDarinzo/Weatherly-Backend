"use strict"

const request = require("supertest");
const axios = require("axios");

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

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "password1"
      });
    expect(resp.body).toEqual({
      "token": expect.any(String)
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "no-such-user",
        password: "password1"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with incorrect password", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "wrong-password"
      });
    expect(resp.statusCode).toEqual(401);
  });

  // TODO: IMPLEMENT WITH JSON SCHEMA 

  // test("bad request with missing data", async function () {
  //   const resp = await request(app)
  //       .post("/auth/token")
  //       .send({
  //         username: "u1",
  //       });
  //   expect(resp.statusCode).toEqual(400);
  // });

  // test("bad request with invalid data", async function () {
  //   const resp = await request(app)
  //       .post("/auth/token")
  //       .send({
  //         username: 42,
  //         password: "above-is-a-number",
  //       });
  //   expect(resp.statusCode).toEqual(400);
  // });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for anon", async function () {

    const resp = await request(app)
    .post("/auth/register")
    .send({
      username: "newUser",
      password: "password",
      postalCode: "00001",
      countryCode: "US"
    });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "token": expect.any(String)
    });
  });

  // TODO: IMPLENENT AFTER JSON SCHEMA

  // test("bad request with missing fields", async function () {
  //   const resp = await request(app)
  //     .post("/auth/register")
  //     .send({
  //       username: "newUser",
  //     });
  //   expect(resp.statusCode).toEqual(400);
  // });

  // test("bad request with invalid data", async function () {
  //   const resp = await request(app)
  //     .post("/auth/register")
  //     .send({
  //       username: "new",
  //       firstName: "first",
  //       lastName: "last",
  //       password: "password",
  //     });
  //   expect(resp.statusCode).toEqual(400);
  // });
});