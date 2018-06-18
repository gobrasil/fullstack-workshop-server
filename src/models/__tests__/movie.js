const makeMovieModel = require('../movie');

describe('Movie Model', () => {
  let mockOpts = {};
  let model = {};

  beforeEach(() => {
    mockOpts = {
      loaders: {
        fetch: {
          load: jest.fn(() => Promise.resolve({ cast: [1, 2, 3] })),
        },
      },
      store: {
        likes: {
          findAll: jest.fn(),
          find: jest.fn(),
          create: jest.fn(),
          destroy: jest.fn(),
        },
      },
    };

    model = makeMovieModel(mockOpts);
  });

  it('[getMovieByid] calls fetcher and returns movie', async () => {
    mockOpts.loaders.fetch.load.mockReturnValueOnce('my movie');
    const res = await model.getMovieById(1);

    expect(res).toEqual('my movie');
    expect(mockOpts.loaders.fetch.load).toBeCalledWith(['/movie/1']);
  });

  it('[getMovies] calls loader with correct params', async () => {
    mockOpts.loaders.fetch.load.mockReturnValueOnce(
      Promise.resolve({ results: ['hey'] }),
    );
    let res = await model.getMovies({ sort: 'POPULARITY', page: 20 });

    expect(res).toEqual(['hey']);
    expect(mockOpts.loaders.fetch.load).toBeCalledWith([
      '/discover/movie',
      { params: { page: 20, sort_by: 'popularity.desc' } },
    ]);

    // change the opts and try again, to make sure they're passed right
    mockOpts.loaders.fetch.load.mockReturnValueOnce(
      Promise.resolve({ results: ['hey'] }),
    );
    res = await model.getMovies({ sort: 'RELEASE_DATE', page: 10 });

    expect(mockOpts.loaders.fetch.load).toBeCalledWith([
      '/discover/movie',
      { params: { page: 10, sort_by: 'release_date.desc' } },
    ]);
  });

  it('[getMovieLikes] looks up likes in store by id and returns', async () => {
    mockOpts.store.likes.findAll.mockReturnValueOnce('hallo');
    const res = await model.getMovieLikes({ user: 2 });

    expect(res).toEqual('hallo');
    expect(mockOpts.store.likes.findAll).toBeCalledWith({ where: { user: 2 } });
  });

  it('[toggleMovieLike] finds likes by user and movie', async () => {
    const res = await model.toggleMovieLike({ user: 2, id: 1 });
    expect(mockOpts.store.likes.find).toBeCalledWith({
      where: { user: 2, movie: 1 },
    });
  });

  it('[toggleMovieLike] creates a like if there isnt one', async () => {
    mockOpts.store.likes.find.mockReturnValueOnce(false);
    const res = await model.toggleMovieLike({ user: 2, id: 1 });

    expect(mockOpts.store.likes.create).toBeCalledWith({ user: 2, movie: 1 });
  });

  it('[toggleMovieLike] deletes a like if there is one', async () => {
    mockOpts.store.likes.find.mockReturnValueOnce(true);
    const res = await model.toggleMovieLike({ user: 2, id: 1 });

    expect(mockOpts.store.likes.destroy).toBeCalledWith({
      where: { user: 2, movie: 1 },
    });
  });

  it('[isMovieLiked] looks up likes in store by id and user', async () => {
    mockOpts.store.likes.find.mockReturnValueOnce({});
    const res = model.isMovieLiked({ id: 1, user: 2 });

    expect(res).toBeTruthy();
    expect(mockOpts.store.likes.find).toBeCalledWith({
      where: { user: 2, movie: 1 },
    });
  });
});
