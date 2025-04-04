import { useEffect, useState } from "react";

import NavBar from "./NavBar";
import Maiin from "./Maiin";
// import tempMovieData from "./TemMovieData";

const KEY = "44f48cca";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  // const tempQuery = "interstellar";

  // useEffect(function () {
  //   console.log("After initial render");
  // }, []);
  // useEffect(function () {
  //   console.log("after evry render");
  // });
  // console.log("during render");

  // useEffect(
  //   function () {
  //     console.log("D");
  //   },
  //   [query]
  // );
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not Found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      {/* {isLoading ? <Loader /> : <Maiin movies={movies} />} */}
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <Maiin
          movies={movies}
          selectedId={selectedId}
          handleSelectedMovie={handleSelectedMovie}
          KEY={KEY}
        />
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
  function Loader() {
    return <p className="loader">Loading...</p>;
  }
  function ErrorMessage({ message }) {
    return (
      <p className="error">
        <span>⛔</span> {message}
      </p>
    );
  }
}

export default App;
