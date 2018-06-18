/*
TODO: write tests for movie resolvers.

The following tests have been stubbed out to fail. Your goal is to make them pass
- it('should get voteCount from movie object')
- it('should get photo with size from args')
- it('returns true if movie is liked')

NOTE: To focus on a test, and don't run the others, change the name of the 
function from `it` to `fit`. This will hide the errors from the other tests and
allow you to focus your work on just one.
*/

const resolvers = require('../movie');

// a simple util to make tests fail
const fail = () => expect(false).toEqual(true);

// TODO: change this to `describe` to run these tests
xdescribe('Movie Resolvers', () => {
  it('should get score from movie object', () => {
    expect(resolvers.Movie.score({ vote_average: 1 })).toEqual(1);
  });

  // TODO (hint: check previous test)
  it('should get voteCount from movie object', () => {
    // TODO: check that response from the resolver is what we expect, given the input
    fail();
  });

  // TODO (hint: check the poster tests for cast)
  it('should get photo with size from args', () => {
    fail();
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

  it('fails lookup of likes if theres no user', () => {
    const res = resolvers.Movie.isLiked({ id: 1 }, null, {});
    expect(res).toBeFalsy();
  });

  // TODO: see notes below for what to check
  it('returns true if movie is liked', () => {
    // Here's a sample context for your tests.
    const mockContext = {
      models: { movie: { isMovieLiked: jest.fn(() => true) } },
      user: { id: 1 },
    };
    const res = resolvers.Movie.isLiked({ id: 1 }, null, mockContext);

    fail();
    // TODO: test that the response is what we expect (look at test name)
    // TODO: make sure the isMovieLiked was called with the correct args (see previous test for help)
  });
});
