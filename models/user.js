"use strict"

const db = require("../db");
const { BadRequestError } = require("../expressError");

/** Functions for users. */

class User {

  /** Register user with data.
 *
 * Returns {  }
 *
 * Throws BadRequestError on duplicates.
 **/

  static async register({ username, password, zipCode }) {
    const duplicateCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`, [username]
    );

    if (duplicateCheck.rows[0]) return new BadRequestError(`Duplicate username: ${username}`);

    const result = await db.query(
      `INSERT INTO users
        (username, password, zip_code)
        VALUES ($1, $2, $3)
        RETURNING id`, [username, password, zipCode]
    );

    const user = result.rows[0];
    return user;
  }
}


module.exports = User;

