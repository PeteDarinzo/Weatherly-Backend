"use strict"

/** Routes for users */

const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const axios = require("axios");
const WatchList = require("../models/watchlist");

const OPEN_WEATHER_URL = "http://api.openweathermap.org/geo/1.0/zip";
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;


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

/** PATCH
 * 
 * Update a user
 * 
 */

router.patch("/:username", async (req, res, next) => {
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
