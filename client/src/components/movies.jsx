import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./common/searchBox";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    searchQuery: "",
    selectedGenre: { _id: "", name: "All Genres" },
    pageSize: 6,
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    try {
      const { data: genresData } = await getGenres();
      const genres = [this.state.selectedGenre, ...genresData];

      const { data: movies } = await getMovies();
      this.setState({ movies, genres });
    } catch (error) {}
  }

  handleDelete = async (movie) => {
    const originalMovie = [...this.state.movies];

    const movies = originalMovie.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("this movie has already delete");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied.");
      }
      this.setState({ movies: originalMovie });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: this.state.genres[0],
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      selectedGenre,
      movies: allMovies,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery) {
      filtered = allMovies.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      console.log(selectedGenre);
      console.log(this.state.genres);
    } else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no movies in the database.</p>;

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="auth-wrapper col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="auth-wrapper auth-inner col" style={{ padding: 20 }}>
          <div className="row">
            <div className="col-md">
              <p>Showing {totalCount} movies in the database.</p>
            </div>
            <div className="col-md-3">
              {user && (
                <Link
                  to="/movies/new"
                  className="btn btn-primary"
                  style={{ marginBottom: 20 }}
                >
                  New Movie
                </Link>
              )}
            </div>
          </div>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
