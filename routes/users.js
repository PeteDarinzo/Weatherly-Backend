"use strict"

/** Routes for users */


const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const WatchList = require("../models/watchlist");


/** GET /[username] => { user }
 * 
 * Returns { username, postalCode, city, minTemp, maxTemp, conditions, units }
 * 
 * 
 */

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
});

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
  try {
    const movie = await WatchList.addMovie({ username: req.params.username, movieId: req.body.movieId });
    return res.status(201).json({ movie });
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
  try {
    await WatchList.removeTitle(req.params.username, req.body.movieId)
  } catch (err) {
    next(err);
  }
});


module.exports = router;
