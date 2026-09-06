import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import "./App.module.css";
import fetchMovies from "../../services/movieService";
import toast from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";

function App() {
  /* ЦЕ ХУКИ */
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isMovieGrid, setIsMovieGrid] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [topic, setTopic] = useState("");

  const {
    data: { results: movies = [], total_pages: totalPages = 0 } = {},
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["topic", topic],
    queryFn: () => fetchMovies(topic, 1),
    enabled: Boolean(topic)
  });

  // useEffect(() => {
  //     if (movies.length === 0 || isError) {
  //     toast.error("No movies found for your request.");
  //   }
  // }, [topic]);
  
  /*ФУНКЦІЯ ІВЕНТ-ЛІСТЕНЕР*/
  const handleOpener = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleClose = () => {
    setSelectedMovie(null);
  };

  console.log(movies);
  /* ЦЕ ФУНКЦІЯ ДЛЯ ЗАПИТА НА СЕРВЕР */
  const getTopic = async (topic: string) => {
    setTopic(topic);
    if (movies.length === 0 && isSuccess) {
      toast.error("No movies found for your request.");
    }
    if(isError){
       toast.error("No movies found for your request.");
    }
  };
  /*RENDER*/
  return (
    <>
      <SearchBar onSubmit={getTopic} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies && <MovieGrid onSelect={handleOpener} movies={movies} />}
      {selectedMovie && (
        <MovieModal onClose={handleClose} movie={selectedMovie} />
      )}
    </>
  );
}

export default App;
