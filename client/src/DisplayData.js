import React, { useState } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
      hasBeenInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

function DisplayData() {
  const [movieBeingSearched, setMovieBeingSearched] = useState("");
  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchData, error: movieSearchError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);
  if (loading) {
    return <h2>loading....</h2>;
  }
  if (error) {
    console.log(error);
  }

  return (
    <div>
      {data &&
        data.users.map((user) => {
          return (
            <div
              key={user.id}
              style={{ border: "1px solid blue", marginBottom: "16px" }}
            >
              <h2>Name: {user.name}</h2>
              <p>Username: {user.username}</p>
              <p>Age: {user.age}</p>
            </div>
          );
        })}
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div
              key={movie.id}
              style={{ border: "1px solid purple", marginBottom: "16px" }}
            >
              <h2>Movie Name: {movie.name}</h2>
              <p>Year Published: {movie.yearOfPublication}</p>
              <p>Has Been in Theaters: {movie.hasBeenInTheaters.toString()}</p>
            </div>
          );
        })}
      <div>
        <input
          type="text"
          placeholder="Interstellar"
          onChange={(e) => {
            setMovieBeingSearched(e.target.value);
          }}
        />
        <button
          onClick={() =>
            fetchMovie({
              variables: {
                name: movieBeingSearched,
              },
            })
          }
        >
          Fetch Movie Data
        </button>
      </div>
      <div>
        {movieSearchData && (
          <div>
            <h2>Movie name: {movieSearchData.movie.name}</h2>
            <p>Year: {movieSearchData.movie.yearOfPublication}</p>
          </div>
        )}
        {movieSearchError && <h2>There was an error fetching the data...</h2>}
      </div>
    </div>
  );
}

export default DisplayData;
