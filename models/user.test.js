"use strict"

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");

const db = require("../db.js");
const User = require("./user");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1"
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("not-a-user", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong-password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** regiser */

describe("register", function () {
  const newUser = {
    username: "new",
    zipCode: "00001"
  }

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password"
    });

    expect(user).toEqual({ username: "new" });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with duplicate username", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password"
      });

      await User.register({
        ...newUser,
        password: "password"
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/**
 * FURTHER TESTS
 * 
 * > GET USER
 * 
 * > EDIT USER
 * 
 * > REMOVE USER
 * 
 */