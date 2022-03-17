"use strict"

/** Routes for authentication */

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");

/** POST /auth/token: { username, password } => { token }
 * 
 * Returns JWT token which can be used to authenticate further requests.
 * 
 * Authorization required: none.
 */

router.post("/token", async (req, res, next) => {
  try {
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
 * user must include { username, password, zipCode }
 * 
 * Returns JWT toekn which can be used to authenticate further requests
 * 
 * Authorization required: none
*/

router.post("/register", async function (req, res, next) {
  try {
    const newUser = await User.register({ ...req.body });
    return res.status(201);
  } catch (err) {
    next(err);
  }
});

module.exports = router;