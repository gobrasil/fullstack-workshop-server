const resolvers = require('../movie');

describe('Movie Resolvers', () => {
  it('should get score from movie object', () => {
    expect(resolvers.Movie.score({ vote_average: 1 })).toEqual(1);
  });
  it('should get voteCount from movie object', () => {
    expect(resolvers.Movie.voteCount({ vote_count: 100 })).toEqual(100);
  });

  it('should get photo with size from args', () => {
    const res = resolvers.Movie.poster({ poster_path: 'lol/' }, { size: 999 });

    // we don't care about the specific url as much
    // as checking to see if the args and profile path
    // were passed through
    expect(res).toContain('lol');
    expect(res).toContain('999');
  });

  it('should get genres from movie object', () => {
    expect(
      resolvers.Movie.genres({ genres: [{ name: 'a' }, { name: 'b' }] }),
    ).toEqual(['a', 'b']);
  });

  it('should get releaseDate from movie object', () => {
    expect(resolvers.Movie.releaseDate({ release_date: 1 })).toEqual(1);
  });

  // we need to mock the underlying models that get passed in the context
  it('looks up cast and returns', () => {
    const mockContext = {
      models: { cast: { getCastByMovie: jest.fn(() => 'cast') } },
    };
    const res = resolvers.Movie.cast({ id: 1 }, null, mockContext);
    expect(res).toEqual('cast');
    expect(mockContext.models.cast.getCastByMovie).toBeCalledWith(1);
  });

  // we need to mock the underlying models that get passed in the context
  it('fails lookup of likes if theres no user', () => {
    const res = resolvers.Movie.isLiked({ id: 1 }, null, {});
    expect(res).toBeFalsy();
  });

  it('looks up if movie is liked', () => {
    const mockContext = {
      models: { movie: { isMovieLiked: jest.fn(() => true) } },
      user: { id: 1 },
    };
    const res = resolvers.Movie.isLiked({ id: 1 }, null, mockContext);

    expect(res).toBeTruthy();
    expect(mockContext.models.movie.isMovieLiked).toBeCalledWith({
      user: { id: 1 },
      id: 1,
    });
  });
});
