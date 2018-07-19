const { RESTDataSource } = require("apollo-datasource-rest");

class IMDB extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.themoviedb.org/3";
  }

  willSendRequest(request) {
    request.params.append("api_key", "4e911a064e43b9cd6fbb3137c572d89a");
    request.params.append("include_adult", false);
  }

  async getMovieById(id) {
    return this.get(`/movie/${id}`);
  }

  async getMovies({ sort, page }) {
    let sortParam = null;
    if (sort === "POPULARITY") sortParam = "popularity.desc";
    else if (sort === "RELEASE_DATE") sortParam = "release_date.desc";

    return this.get("/discover/movie", { page, sort_by: sortParam }).then(
      json => json.results || []
    );
  }

  async getCastByMovie(id) {
    return this.get(`/movie/${id}/credits`).then(json => json.cast || []);
  }
}

module.exports = IMDB;
