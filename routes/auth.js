"use strict"

/** Routes for authentication */

require('dotenv').config()
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const axios = require("axios");
const jsonschema = require("jsonschema");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require('../expressError');
const OPEN_WEATHER_URL = "http://api.openweathermap.org/geo/1.0/zip";
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

/** POST /auth/token: { username, password } => { token }
 * 
 * Returns JWT token which can be used to authenticate further requests.
 * 
 * Authorization required: none.
 */

router.post("/token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});


/** POST /auth/register: { user } => { token }
 * 
 * user must include { username, password, postalCode, countryCode }
 * 
 * Returns JWT tiken which can be used to authenticate further requests
 * 
 * Authorization required: none
*/

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { postalCode, countryCode } = req.body;
    const coordRes = await axios.get(`${OPEN_WEATHER_URL}`, {
      params: {
        zip: `${postalCode},${countryCode}`,
        appid: OPEN_WEATHER_KEY
      }
    });
    const { lat, lon, name } = coordRes.data;
    const userData = { ...req.body, lat, lon, city: name }
    const newUser = await User.register(userData);
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;