
CREATE TABLE users (username VARCHAR(15) PRIMARY KEY,
                    password TEXT NOT NULL,
                    postal_code VARCHAR(15) NOT NULL,
                    lat TEXT,
                    lon TEXT,
                    city TEXT,
                    country_code TEXT,
                    units VARCHAR(15),
                    max_temp INTEGER,
                    min_temp INTEGER,
                    thunderstorm BOOLEAN DEFAULT FALSE,
                    drizzle BOOLEAN DEFAULT FALSE,
                    rain BOOLEAN DEFAULT FALSE,
                    snow BOOLEAN DEFAULT FALSE,
                    overcast BOOLEAN DEFAULT FALSE
                    );

CREATE TABLE movies (id TEXT PRIMARY KEY,
                     title TEXT NOT NULL,
                     poster_url TEXT
                     );

CREATE TABLE watchlist (username VARCHAR(15) REFERENCES users,
                          movie_id TEXT REFERENCES movies,
                          watched BOOLEAN,
                          date DATE,
                          notes TEXT
                          );