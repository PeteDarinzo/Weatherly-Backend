const express = require("express");
const router = new express.Router();
const axios = require("axios");
const WatchList = require("../models/watchList");

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
 * 
 */

router.post("/:userId/movies", async (req, res, next) => {
  console.log("saving to watchlist");
  try {
    await WatchList.addMovie({ userId: req.params.userId, movieId: req.body.movieId });
  } catch (err) {
    next(err);
  }
});

/** DELETE 
 * 
 * Delete a title from a user's watchlist
 * 
 */

router.delete("/:userId/movies", async (req, res, next) => {
  console.log(`deleting ${req.body.movieId}`);
  try {
    await WatchList.removeTitle(req.params.userId, req.body.movieId)
  } catch (err) {
    next(err);
  }
});


module.exports = router;
