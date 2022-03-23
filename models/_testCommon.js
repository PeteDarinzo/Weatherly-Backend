const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM movies");
  await db.query("DELETE FROM users");

  await db.query(`
  INSERT INTO movies(id, title, poster_url)
  VALUES ('testId-1', 'title-1', 'http://c1.img'),
         ('testId-2', 'title-2', 'http://c2.img'),
         ('testId-3', 'title-3', 'http://c3.img')`);

  await db.query(`
         INSERT INTO users(username,
                           password,
                           postal_code,
                           lat,
                           lon,
                           city,
                           country_code,
                           units
                           )
         VALUES ('u1', $1, '00001', '0', '0', 'test-city', 'US', 'imperial'),
                ('u2', $2, '00002', '0', '0', 'test-city', 'US', 'celsius')
         RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
}