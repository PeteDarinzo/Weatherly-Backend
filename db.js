/** Database connnection for Weatherly */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let client


/** MY METHOD **/
if (process.env.NODE_ENV === "production") {
  client = new Client({
    host: "localhost",
    user: "pete",
    password: "vampire",
    database: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  client = new Client({
    host: "localhost",
    user: "pete",
    password: "vampire",
    database: getDatabaseUri()
  });
}
/** END MY METHOD **/


// let DB_URI;

// DB_URI = {
//   host: "localhost",
//   user: "pete",
//   password: "vampire",
//   database: ""
// }

// DB_URI.database = ("weatherly");

// const client = new Client(DB_URI);

client.connect();

module.exports = client;