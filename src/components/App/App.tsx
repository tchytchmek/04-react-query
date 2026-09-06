import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import "./App.module.css";
import fetchMovies from "../../services/movieService";
import toast from "react-hot-toast";
import type {Movie} from "../../types/movie";
import { useState } from "react";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

// interface MovieHook {
//   movies: Movie[],
//   setMovies: (value: Movie[]) => void,
// }
function App() {
  /* ЦЕ ХУКИ */
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieGrid, setIsMovieGrid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /*ФУНКЦІЯ ІВЕНТ-ЛІСТЕНЕР*/
  const handleOpener = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleClose = () => {
    setSelectedMovie(null);
  };

  /* ЦЕ ФУНКЦІЯ ДЛЯ ЗАПИТА НА СЕРВЕР */
  const getTopic = async (topic: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(topic);
      console.log(data);

      if (data.length === 0) {
        toast.error("No movies found for your request.");
        setIsMovieGrid(false);
      }

      setMovies(data);
      setIsMovieGrid(true);
    } catch {
      toast.error("No movies found for your request.");
      setIsMovieGrid(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  /*RENDER*/
  return (
    <>
      <SearchBar onSubmit={getTopic} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isMovieGrid && <MovieGrid onSelect={handleOpener} movies={movies} />}
      {selectedMovie && (
        <MovieModal onClose={handleClose} movie={selectedMovie} />
      )}
    </>
  );
}

export default App;
