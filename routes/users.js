"use strict"

/** Routes for users */

const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const axios = require("axios");
const WatchList = require("../models/watchlist");
const { ensureCorrectUser } = require("../middleware/auth");

const OPEN_WEATHER_URL = "http://api.openweathermap.org/geo/1.0/zip";
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;


/** GET /[username]: => { user }
 * 
 * Returns { 
 * username, 
 * postalCode, 
 * city, 
 * minTemp, 
 * maxTemp, 
 * thunderstorm,
 * drizzle,
 * rain,
 * snow,
 * overcast, 
 * units }
 * 
 */

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/movies:
 *   
 * Get a user's watchlist
 * 
 * returns { titles }
 * 
 */

router.get("/:username/movies", async (req, res, next) => {
  const titles = await WatchList.getTitles(req.params.username);
  return res.json(titles);
});


/** POST /[username]/movies: { movie }
 * 
 * Save a movie to a user's watchlist
 * 
 * returns { movie }
 * 
 */

router.post("/:username/movies", ensureCorrectUser, async (req, res, next) => {
  try {
    const movie = await WatchList.addMovie(req.params.username, req.body.movieId);
      return res.status(201).json({ movie });
  } catch (err) {
    next(err);
  }
});

/** PATCH /[username]: { userData }
 * 
 * Update a user's location or weather preferences
 * 
 * returns { user }
 * 
 */

router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    let userData;
    if (req.body.postalCode) {
      const { postalCode, countryCode } = req.body;
      const coordRes = await axios.get(`${OPEN_WEATHER_URL}`, {
        params: {
          zip: `${postalCode},${countryCode}`,
          appid: OPEN_WEATHER_KEY
        }
      });
      const { lat, lon, name } = coordRes.data;
      userData = { ...req.body, lat, lon, city: name };
    } else {
      userData = { ...req.body };
    }
    const user = await User.update(req.params.username, userData);
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

/** DELETE /[username]/movies: { movieId }
 * 
 * Delete a title from a user's watchlist
 * 
 * returns { deleted: movieId }
 * 
 */

router.delete("/:username/movies", ensureCorrectUser, async (req, res, next) => {
  try {
    await WatchList.removeTitle(req.params.username, req.body.movieId);
    return res.json({ deleted: req.body.movieId });
  } catch (err) {
    next(err);
  }
});




module.exports = router;
