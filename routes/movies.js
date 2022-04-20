"use strict"

/** Routes for movies */

require('dotenv').config()
const express = require("express");
const router = new express.Router();
const axios = require("axios");
const Movie = require("../models/movie");

const OMDB_URL = "http://www.omdbapi.com/?";
const OMDB_KEY = process.env.OMBD_KEY;

/** GET /title: { title } 
 * 
 * Query OMDB for movies by title
 * 
 * Returns list of JSON movie data
 */

router.get("/title", async (req, res, next) => {
  try {
    const movies = await axios.get(`${OMDB_URL}`, { params: { s: req.query.title, apikey: OMDB_KEY } });
    return res.status(200).json(movies.data);
  } catch (err) {
    next(err);
  }
});

/** GET /id: { id } 
 * 
 * Query OMDB for movies by id
 * 
 * Returns JSON movie data
 */

router.get("/id", async (req, res, next) => {
  try {
    const movie = await axios.get(`${OMDB_URL}`, { params: { i: req.query.movieId, apikey: OMDB_KEY } });
    return res.status(200).json(movie.data);
  } catch (err) {
    next(err);
  }
});

/** POST /save: { id, title, posterUrl }
 * 
 * Add movie to database
 * 
 * Returns { movie } or { msg: "Movie already exists." }
 * 
 */

router.post("/save", async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body });
    if (movie) {
      return res.status(201).json({ movie });
    } else {
      const msg = "Movie already exists.";
      return res.status(200).json({ msg });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;