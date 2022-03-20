const express = require("express");
const router = new express.Router();
const axios = require("axios");
const OMBDKey = require("../API_KEY");
const Movie = require("../models/movie");

const OMDB_URL = "http://www.omdbapi.com/?";

/** GET / { movieId }
 * 
 * Query OMBD for a movie by id
 * 
 * Returns JSON movie data
 */

router.get("/:movieId", async (req, res, next) => {
  console.log("Getting movie from omdb");
  try {
    const movie = await axios.get(`${OMDB_URL}`, { params: { i: req.params.movieId, apikey: OMBDKey } });
    return res.status(200).json(movie.data);
  } catch (err) {
    next(err);
  }
});

/** GET / { title }
 * Query OMDB for a movie by title
 * 
 * Returns JSON movie data
 */

router.get("/title/:title", async (req, res, next) => {
  try {
    const movies = await axios.get(`${OMDB_URL}`, { params: { t: req.params.title, apikey: OMBDKey } });
    return res.status(200).json(movies.data);
  } catch (err) {
    next(err);
  }
});


/** POST / { id, title, posterUrl }
 * 
 * Add movie to database
 * 
 * Returns { }
 * 
 */

router.post("/save", async (req, res, next) => {
  try {
    let movie = await Movie.create({ ...req.body });
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