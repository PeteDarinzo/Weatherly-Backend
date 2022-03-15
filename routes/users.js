const express = require("express");
const router = new express.Router();
const axios = require("axios");
const WatchList = require("../models/watchList");

/** GET / { user } => {user}
 *  
 * 
 */

router.get("/:username/movies", async function (req, res, next) {
  console.log("getting the titles");
  const titles = await WatchList.getTitles(req.params.username);
  return res.json(titles);
});

module.exports = router;