const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//API 1
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
        SELECT *
        FROM movie;
    `;
  const moviesDetails = await db.all(getMoviesQuery);
  response.send(
    moviesDetails.map((eachMovie) => {
      const movie = convertDbObjectToResponseObject(eachMovie);
      return {
        movieName: `${movie.movieName}`,
      };
    })
  );
});

//API 2
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
        SELECT *
        FROM movie
        WHERE 
        movie_id=${movieId};
    `;
  const movie = await db.get(getMovieQuery);
  response.send(convertDbObjectToResponseObject(movie));
});

module.exports = app;
