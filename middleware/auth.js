"use strict"

/** Middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user. 
 * 
 * If a token was provided, verify it, if valid, store the token payload on res.locals (this will include the username)
 * 
 * It's not an error if no token was provided or if the token is not valid.
*/

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    next();
  } catch (err) {
    next();
  }
}

/** Middleware for when user must be logged in. 
 * 
 * If not raise Unauthorized
*/

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    next()
  } catch (err) {
    next(err);
  }
}

/** Middleware to use when user must provide a valid token and be the matching user
 * 
 * username provieded as route param
 * 
 * If not, raises Unathorized
 */

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.username === req.params.username))) {
      throw new UnauthorizedError();
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
}