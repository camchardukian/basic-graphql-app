import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";

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

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

function DisplayData() {
  const [movieBeingSearched, setMovieBeingSearched] = useState("");
  const [idToBeDeleted, setIdToBeDeleted] = useState("");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");

  const {
    data,
    loading,
    error: userListError,
    refetch,
  } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchData, error: movieSearchError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  if (loading) {
    return <h2>loading....</h2>;
  }
  if (userListError) {
    console.log(userListError);
  }

  return (
    <div>
      <div style={{ border: "3px solid green", marginTop: 16 }}>
        <input
          type="text"
          placeholder="Name..."
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(e) => {
            setAge(parseInt(e.target.value));
          }}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(e) => {
            setNationality(e.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: { input: { name, username, age, nationality } },
            });
            refetch();
          }}
        >
          Create User
        </button>
      </div>
      <div style={{ border: "3px solid tomato", marginTop: 16 }}>
        <input
          type="text"
          placeholder="Id of user to be deleted..."
          onChange={(e) => setIdToBeDeleted(e.target.value)}
        />
        <button
          onClick={() => {
            deleteUser({ variables: { id: idToBeDeleted } });
            refetch();
          }}
        >
          Delete User
        </button>
      </div>
      {data &&
        data.users.map((user) => {
          return (
            <div
              key={user.id}
              style={{ border: "1px solid blue", marginBottom: "16px" }}
            >
              <h2>Name: {user.name}</h2>
              <p>ID: {user.id}</p>
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
