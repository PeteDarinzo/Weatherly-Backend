/** Database connnection for Weatherly */

const { Client } = require("pg");

let DB_URI;

DB_URI = {
  host: "localhost",
  user: "pete",
  password: "vampire",
  database: ""
}

DB_URI.database = ("weatherly");

const client = new Client(DB_URI);

client.connect();

module.exports = client;