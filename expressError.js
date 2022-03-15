/** ExpressError extends mormal JS error
 * 
 * adding a status when a making an instance of it
 * 
 * This is returned by the error-handling middleware
 */

class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

/** 404 NOT FOUND ERROR */

class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/** 401 UNAUTHORIZED error */

class UnauthorizedError extends ExpressError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/** 401 UNAUTHORIZED error */

class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/** 401 UNAUTHORIZED error */

class ForbiddenError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 403);
  }
}

module.exports = {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError
};