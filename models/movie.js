"use strict"

const db = require("../db");
const { BadRequestError } = require("../expressError");


/** Functions for movies. */

class Movie {


  /** Create a movie, update db, return new movie data.
   * 
   * data should be {id, title, posterUrl}
   * 
   * Returns {title, posterUrl}
   * 
   * Throws Badrequesterror if duplicate
   * 
   */

  static async create({ id, title, posterUrl }) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM movies 
       WHERE id = $1`,
      [id]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate movie: ${title}`);

    const result = await db.query(
      `INSERT INTO movies
      (id, title, poster_url)
      VALUES ($1, $2, $3)
      RETURNING id`,
      [id, title, posterUrl]);

    const movie = result.rows;
    return movie;
  }

}

module.exports = Movie;