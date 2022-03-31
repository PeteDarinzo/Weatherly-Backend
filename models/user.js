"use strict"

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
const sqlForPartialUpdate = require("../helpers/sql");

/** Functions for users. */

class User {

  /** Return a user's data
   * Returns { username, postalCode, country, maxTemp, minTemp, conditions, units }
   * 
   * Throws NotFoundError if user not found.
   */

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
        postal_code AS "postalCode",
        lat,
        lon,
        city,
        country_code AS "countryCode",
        max_temp AS "maxTemp",
        min_temp AS "minTemp",
        units,
        thunderstorm,
        drizzle,
        rain,
        snow,
        overcast
      FROM users
      WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Authenticate user with username and password
   * 
   * Returns { username }
   * 
   * Throws UnauthorizedError if user not found or incorrect password.
   */

  static async authenticate(username, password) {
    // verify user exists
    const result = await db.query(
      `SELECT username,
      password
      FROM users 
      WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }
    // user does not exist or password is incorrect
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data
   * 
   * Returns { id }
   * 
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, postalCode, lat, lon, city, countryCode }) {
    const duplicateCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`, [username]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
        (username, password, postal_code, lat, lon, city, country_code, units)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING username`, [username, hashedPassword, postalCode, lat, lon, city, countryCode, "imperial"]
    );

    const user = result.rows[0];
    return user;
  }

  static async update(username, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        postalCode: "postal_code",
        countryCode: "country_code",
        minTemp: "min_temp",
        maxTemp: "max_temp"
      });
    const usernameVarIdx = "$" + (values.length + 1); // make username last item

    const querySql = `UPDATE users
                      SET ${setCols}
                      WHERE username = ${usernameVarIdx}
                      RETURNING 
                                username,
                                postal_code AS "postalCode",
                                lat,
                                lon,
                                city,
                                country_code AS "countryCode",
                                max_temp AS "maxTemp",
                                min_temp AS "minTemp",
                                units,
                                thunderstorm,
                                drizzle,
                                rain,
                                snow,
                                overcast`;

    const result = await db.query(querySql, [...values, username]); // username is always the last value
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    return user;
  }
}



module.exports = User;

