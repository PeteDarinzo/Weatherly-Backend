"use strict"

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

  static async addMovie({ username, movieId }) {
    console.log("duplicate check");
    const duplicateCheck = await db.query(
      `SELECT username, movie_id
      FROM watchlist
      WHERE username = $1 AND movie_id = $2`,
      [username, movieId]);

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate movie ${movieId}`);
    console.log("no duplicates");

    const result = await db.query(
      `INSERT INTO watchlist
      (username, movie_id, watched)
      VALUES ($1, $2, $3)
      RETURNING username, movie_id AS movieId`,
      [username, movieId, false]
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
        ON w.username= u.username
        WHERE u.username = $1`,
      [username]);
    const list = result.rows;
    return list;
  }

  /** Remove a particular title from a user's watchlist
   * 
   * 
   * 
   */

  static async removeTitle(username, movieId) {
    const result = db.query(
      `DELETE FROM watchlist
       WHERE username = $1
       AND movie_id = $2`,
      [username, movieId])
  }

}

module.exports = WatchList;

