"use strict"

const db = require("../db");


/** Functions for movies. */

class Movie {

  /** Create a movie, update db, return new movie data.
   * 
   * data should be {id, title, posterUrl}
   * 
   * Returns {title, posterUrl}
   * 
   * Returns if duplicate
   * 
   */

  static async create({ id, title, posterUrl }) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM movies 
       WHERE id = $1`,
      [id]
    );

    // not an error if a movie already exists
    if (duplicateCheck.rows[0]) return;

    const result = await db.query(
      `INSERT INTO movies
      (id, title, poster_url)
      VALUES ($1, $2, $3)
      RETURNING id, title, poster_url AS "posterUrl"`,
      [id, title, posterUrl]);

    return result.rows[0];
  }

}

module.exports = Movie;