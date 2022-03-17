/** Database connnection for Weatherly */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db

/** Springboard Method */
if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri()
  });
}
/** END Springboard Method */


/** MY METHOD **/
// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     host: "localhost",
//     user: "",
//     password: "",
//     database: getDatabaseUri(),
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// } else {
//   db = new Client({
//     host: "localhost",
//     user: "",
//     password: "",
//     database: getDatabaseUri()
//   });
}
/** END MY METHOD **/

db.connect();

module.exports = db;