# Capstone-2 (Ad Interim: Weather.ly)

## Developer: Peter Darinzo

### View the frontend repository here: [Weatherly-Frontend](https://github.com/PeteDarinzo/Weatherly-Frontend)

[Installation](#installation)  
[Testing](#testing)

## About 

This the backendend repository for the Weatherly app. It is to be installed and used in conjunction with the frontend repository.

## Installation

### Before beginning:

The [node package manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is required to run this app. The app also requires [Postgresql](https://www.postgresql.org/download/) for the database.

## Instructions

1. Get a free Open Weather Map API key, or use the one obtained from installing [the frontend](https://github.com/PeteDarinzo/Weatherly-Frontend), if available.

```
https://home.openweathermap.org/users/sign_up
```

2. Get a free Open Movie Database API key.

```
https://www.omdbapi.com/apikey.aspx
```

2. Clone the repo.

```
git clone https://github.com/PeteDarinzo/Weatherly-Backend
```

3. Install all packages

```
npm i
```

4. Create a .env file in the root directory and add the Open Weather API key, and the Open Movie Database API key as follows

```
OMBD_KEY = [your OMBD key]
OPEN_WEATHER_KEY = [your Open Weather Map API key]
```

5. Add .env to the .gitignore folder so that the Open Weather Map key doesn't become accidentally shared.

6. Start Postgresql, and install the database.

```
sudo service postgresql start
psql < data.sql
```

7. Start the server.

```
node server.js
```

8. At this point the frontend can be started in accordance with [this repository](https://github.com/PeteDarinzo/Weatherly-Frontend).

## Testing

1. Enter the following command to run all tests.

```
jest
```

2. To run a single test file, add the files name after the jest command.

```
jest example.test.js
```