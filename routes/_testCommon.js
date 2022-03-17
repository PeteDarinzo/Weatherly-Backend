"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Movie = require("../models/movie");
const WatchList = require("../models/watchlist");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM movies");

  await Movie.create(
    {
      id: "testId-1",
      title: "title-1",
      posterUrl: "http://c1.img",
    });
  await Movie.create(
    {
      id: "testId-2",
      title: "title-2",
      posterUrl: "http://c2.img",
    });
  await Movie.create(
    {
      id: "testId-3",
      title: "title-3",
      posterUrl: "http://c3.img",
    });


  await User.register({
    username: "u1",
    password: "password1",
    zipCode: "00001",
  });
  await User.register({
    username: "u2",
    password: "password2",
    zipCode: "00002",
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });



module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};