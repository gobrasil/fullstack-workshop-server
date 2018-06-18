const resolvers = require('../mutation');

describe('Mutation Resolvers', () => {
  it('[toggleLike] should error if no user', async done => {
    return resolvers.Mutation.toggleLike(null, {}, {}).catch(err => {
      expect(err).toBeDefined;
      done();
    });
  });

  it('[toggleLike] calls toggleLike and returns movie', async () => {
    const mockContext = {
      models: {
        movie: {
          toggleMovieLike: jest.fn(),
          getMovieById: jest.fn(() => ({ title: 'wow' })),
        },
      },
      user: 1,
    };

    const res = await resolvers.Mutation.toggleLike(
      null,
      { id: 1 },
      mockContext,
    );

    expect(mockContext.models.movie.toggleMovieLike).toBeCalledWith({
      id: 1,
      user: 1,
    });
    expect(mockContext.models.movie.getMovieById).toBeCalledWith(1);
    expect(res).toEqual({ title: 'wow' });
  });

  it('[login] encodes email arg', () => {
    expect(resolvers.Mutation.login(null, { email: 'a@a.a' })).toEqual(
      'YUBhLmE=',
    );
  });
});
