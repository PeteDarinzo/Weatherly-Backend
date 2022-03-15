"use strict"

const { user } = require("pg/lib/defaults");
const db = require("../db");
const { BadRequestError } = require("../expressError");

/** Functions for usersmovies table */

class WatchList {

  /** Add user/movie relationship
   * 
   * Returns {}
   * 
   * Throws BadRequestError on duplicates.
   */

  static async addMovie({ userId, movieId }) {
    const duplicateCheck = await db.query(
      `SELECT user_id, movie_id
      FROM watchlist
      WHERE user_id = $1 AND movie_id = $2`,
      [userId, movieId]);

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate movie ${movieId}`);

    const date = new Date();

    const result = await db.query(
      `INSERT INTO watchlist
      (user_id, movie_id, watched, date)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id AS userId, movie_id AS movieId`,
      [userId, movieId, false, date.toDateString()]
    );
    return result.rows[0];
  }

  /** Get all of a particular user's movies
   * 
   * Returns {} 
   * 
   */

  static async getTitles(username) {
    const result = await db.query(
      `SELECT m.id, m.title, m.poster_url AS "posterUrl"
        FROM movies m
        JOIN watchlist w 
        ON m.id = w.movie_id
        JOIN users u
        ON w.user_id = u.id
        WHERE u.username = $1`,
      [username]);
    const list = result.rows;
    return list;
  }
}

module.exports = WatchList;

