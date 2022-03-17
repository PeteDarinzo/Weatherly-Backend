const express = require("express");
const router = new express.Router();
const axios = require("axios");
const WatchList = require("../models/watchlist");

/** GET / { user } 
 *   
 * Get a user's watchlist
 * 
 */

router.get("/:username/movies", async (req, res, next) => {
  const titles = await WatchList.getTitles(req.params.username);
  return res.json(titles);
});


/** POST / {}
 * 
 * Save a movie to a user's watchlist
 * 
 */

router.post("/:username/movies", async (req, res, next) => {
  console.log("saving to watchlist");
  try {
    await WatchList.addMovie({ username: req.params.username, movieId: req.body.movieId });
  } catch (err) {
    next(err);
  }
});

/** DELETE 
 * 
 * Delete a title from a user's watchlist
 * 
 */

router.delete("/:username/movies", async (req, res, next) => {
  console.log(`deleting ${req.body.movieId}`);
  try {
    await WatchList.removeTitle(req.params.username, req.body.movieId)
  } catch (err) {
    next(err);
  }
});


module.exports = router;
