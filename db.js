/** Database connnection for Weatherly */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// const db = new Client({
//   connectionString: getDatabaseUri(),
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

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
// password must be assigned to Postgresql user using ALTER USER 
// See: https://chartio.com/resources/tutorials/how-to-set-the-default-user-password-in-postgresql/
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
// }
/** END MY METHOD **/

db.connect();

module.exports = db;

