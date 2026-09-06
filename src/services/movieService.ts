import axios from "axios";
import type { Movie } from "../types/movie";

const url =
  "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US";
const authToken = import.meta.env.VITE_API_ACCESS_TOKEN;

interface MoviesQuery {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(
  query: string,
  page: number = 1,
): Promise<MoviesQuery> {
  const { data } = await axios.get<MoviesQuery>(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    params: {
      query: query,
      page: page,
    },
  });
  return data;
}
