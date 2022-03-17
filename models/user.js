"use strict"

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

/** Functions for users. */

class User {

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

  static async register({ username, password, zipCode }) {
    const duplicateCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`, [username]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
        (username, password, zip_code)
        VALUES ($1, $2, $3)
        RETURNING username`, [username, hashedPassword, zipCode]
    );

    const user = result.rows[0];
    return user;
  }
}


module.exports = User;

