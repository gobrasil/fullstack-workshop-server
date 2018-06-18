const makeCastModel = require('../cast');

describe('Cast Model', () => {
  let mockOpts = {};

  beforeEach(() => {
    mockOpts = {
      loaders: {
        fetch: {
          load: jest.fn(() => Promise.resolve({ cast: [1, 2, 3] })),
        },
      },
    };
  });

  it('calls fetcher and return cast', async () => {
    const model = makeCastModel(mockOpts);
    const res = await model.getCastByMovie(1);

    expect(res).toEqual([1, 2, 3]);
    expect(mockOpts.loaders.fetch.load).toBeCalledWith(['/movie/1/credits']);
  });
});
