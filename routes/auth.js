"use strict"

/** Routes for authentication */

const User = require("../models/user");
const express = require("express");
const router = new express.Router();


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