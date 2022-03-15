DROP DATABASE IF EXISTS "weatherly";

CREATE DATABASE "weatherly";

\c "weatherly"

CREATE TABLE users (id SERIAL PRIMARY KEY,
                    username VARCHAR(15) NOT NULL,
                    password TEXT NOT NULL,
                    zip_code TEXT NOT NULL,
                    lat_lon TEXT,
                    max_temp INTEGER,
                    min_temp INTEGER,
                    conditions TEXT
                    );

CREATE TABLE movies (id TEXT PRIMARY KEY,
                     title TEXT NOT NULL,
                     poster_url TEXT
                     );

CREATE TABLE watchlist (user_id INTEGER REFERENCES users,
                          movie_id TEXT REFERENCES movies,
                          watched BOOLEAN,
                          date DATE,
                          notes TEXT
                          );


