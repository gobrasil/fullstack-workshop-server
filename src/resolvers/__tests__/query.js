const resolvers = require('../query');

describe('Query Resolvers', () => {
  const mockMovie = { id: 1, title: 'hey' };

  it('[movie] calls movie lookup model', () => {
    const mockContext = {
      models: { movie: { getMovieById: jest.fn(() => mockMovie) } },
    };
    expect(resolvers.Query.movie(null, { id: 1 }, mockContext)).toEqual(
      mockMovie,
    );
  });

  it('[movies] doesnt allow large page numbers', () => {
    expect(() => resolvers.Query.movies(null, { page: 99999 }, {})).toThrow();
  });

  it('[movies] calls movie lookup model', () => {
    const mockContext = {
      models: { movie: { getMovies: jest.fn(() => [mockMovie]) } },
    };
    expect(
      resolvers.Query.movies(
        null,
        { sort: 'POPULARITY', page: 10 },
        mockContext,
      ),
    ).toEqual([mockMovie]);
    expect(mockContext.models.movie.getMovies).toBeCalledWith({
      sort: 'POPULARITY',
      page: 10,
    });
  });

  it('[likes] gets likes by user', async () => {
    const mockContext = {
      models: {
        movie: {
          getMovieById: jest.fn(() => mockMovie),
          getMovieLikes: jest.fn(() => [{ movie: 1 }]),
        },
      },
      user: 1,
    };

    const res = await resolvers.Query.likes(null, null, mockContext);

    expect(res).toEqual([mockMovie]);
    expect(mockContext.models.movie.getMovieById).toBeCalledWith(1);
    expect(mockContext.models.movie.getMovieLikes).toBeCalledWith({ user: 1 });
  });
});
