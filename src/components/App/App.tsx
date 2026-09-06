import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import toast from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [topic, setTopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: { results: movies = [], total_pages: totalPages = 0 } = {},
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["topic", topic, currentPage],
    queryFn: () => fetchMovies(topic, currentPage),
    enabled: Boolean(topic),
    placeholderData: keepPreviousData,
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
    if (isError) {
      toast.error("No movies found for your request.");
    }
    setCurrentPage(1);
  };
  /*RENDER*/
  return (
    <>
      <SearchBar onSubmit={getTopic} />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
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
