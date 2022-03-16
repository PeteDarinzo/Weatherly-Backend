const express = require("express");
const router = new express.Router();
const axios = require("axios");
const OMBDKey = require("../API_KEY");
const Movie = require("../models/movie");
const WatchList = require("../models/watchList");

const OMDB_URL = "http://www.omdbapi.com/?";

/** GET / { movieId }
 * 
 * 
 * 
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

/**  POST / { }
 * 
 */
router.post("/", async (req, res, next) => {
  try {
    const movies = await axios.get(`${OMDB_URL}`, { params: { t: req.body.title, apikey: OMBDKey } });
    return res.status(200).json(movies.data);
  } catch (err) {
    next(err);
  }
});


/** POST / { movie }
 * 
 * movie should be { id, title, posterUrl }
 * 
 * Returns { }
 * 
 */

router.post("/save", async (req, res, next) => {
  try {
    await Movie.create({ ...req.body });
    await WatchList.addMovie({ userId: 1, movieId: req.body.id });
  } catch (err) {
    next(err)
  }
});

module.exports = router;