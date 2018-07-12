/* TODO: Implement the resolvers for Query

Remember the resolver function signature:
fieldName: (obj, args, context, info) => result;

Check models/movie for the data fetching functions you'll need to complete the exercise.
Refer to your schema if you're unsure what to return from the resolvers.
Good luck!
*/

module.exports = {
  Query: {
    movie: (root, { id }, { dataSources }) => dataSources.imdb.getMovieById(id),
    movies: (root, { sort, page = 1 }, { dataSources }) => {
      // API restriction
      if (page > 1000)
        throw new Error("Page must be less than or equal to 1000");
      return dataSources.imdb.getMovies({ sort, page });
    },
    likes: async (root, args, { dataSources, user }) => {
      const likes = await dataSources.likes.getMovieLikes({ user });
      return likes.map(({ movie }) => dataSources.imdb.getMovieById(movie));
    }
  }
};
