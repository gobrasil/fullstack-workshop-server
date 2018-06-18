/* 
TODO: write tests for query execution with common queries our clients may use

- using a tool like engine, we could see our most popular queries
  and test those exact queries to make sure they don't break.
- this file only runs 1 query for every top-level query and mutation,
  but in real world scenarios, you may want more
  
The following tests have been stubbed out to fail. Your goal is to make them pass
- it('[Query > movie]')
- id('[Mutation > login]')

NOTE: To focus on a test, and don't run the others, change the name of the 
function from `it` to `fit`. This will hide the errors from the other tests and
allow you to focus your work on just one.
*/
const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const { gql } = require('apollo-server');

const resolvers = require('../resolvers');
const typeDefs = require('../schema');

const fail = () => expect(false).toEqual(true);
// combine our real typedefs with real resolvers to execute against
// if all our data fetching functions are coming from the context,
// this works splendidly, as resolvers just route data. They don't
// care where it comes from (our mocked context, below)
const schema = makeExecutableSchema({ typeDefs, resolvers });

// a simple movie to be used in our mock data lookup fns
// should be similar to what you REST calls return
const mockMovie = {
  title: 'Jurassic World: Fallen Kingdom',
  id: 351286,
  vote_average: 6.8,
  genres: [{ name: 'cool' }, { name: 'great' }],
  poster_path: '/okay',
};

// context to be used when executing the `graphql` function
const mockContext = {
  models: {
    movie: {
      getMovieById: jest.fn(() => mockMovie),
      getMovies: jest.fn(() => [mockMovie]),
      getMovieLikes: jest.fn(() => [{ movie: 351286, user: 1 }]),
      toggleMovieLike: jest.fn(),
      isMovieLiked: jest.fn(() => true),
    },
    cast: {
      getCastByMovie: jest.fn(),
    },
  },
  user: 1,
};

// TODO: change this to `describe` to run these tests
xdescribe('Query', () => {
  it('[Query > movies] returns expected data', async () => {
    // try to choose example queries that are a bit complicated
    // like using arguments, secondary API calls, or fields that are a
    // result of transforming REST responses (like genres/score)
    const SAMPLE_MOVIES_QUERY = gql`
      {
        movies {
          title
          id
          poster(size: 500) # uses an arg to calculate response
          score # renamed from REST response
          genres # transformed from REST response
          isLiked # secondary lookup needed for this
        }
      }
    `;

    // execute the query
    const res = await graphql(schema, SAMPLE_MOVIES_QUERY, {}, mockContext);

    // check to make sure everything was fetched properly from the
    // models and transformed properly by the resolvers
    expect(res).toEqual({
      data: {
        movies: [
          {
            genres: ['cool', 'great'],
            id: '351286',
            isLiked: true,
            poster: 'https://image.tmdb.org/t/p/w500/okay',
            score: 6.8,
            title: 'Jurassic World: Fallen Kingdom',
          },
        ],
      },
    });
  });

  it('[Query > movie] returns expected data', async () => {
    const SAMPLE_MOVIE_QUERY = gql`
      {
        movie(id: "351286") {
          title
          id
          score
        }
      }
    `;

    fail();
    // TODO: execute the query
    // TODO: check the response
  });

  it('[Query > likes] returns expected data', async () => {
    const SAMPLE_LIKES_QUERY = gql`
      {
        likes {
          id
          isLiked
        }
      }
    `;

    // execute the query
    const res = await graphql(schema, SAMPLE_LIKES_QUERY, {}, mockContext);

    expect(res).toEqual({
      data: {
        likes: [
          {
            id: '351286',
            isLiked: true,
          },
        ],
      },
    });
  });
});

xdescribe('Mutation', () => {
  it('[Mutation > toggleLike] returns expected data', async () => {
    const SAMPLE_TOGGLE_MUTATION = gql`
      mutation toggle {
        toggleLike(id: "351286") {
          id
          title
        }
      }
    `;

    // execute the mutation
    const res = await graphql(schema, SAMPLE_TOGGLE_MUTATION, {}, mockContext);

    expect(res).toEqual({
      data: {
        toggleLike: {
          id: '351286',
          title: 'Jurassic World: Fallen Kingdom',
        },
      },
    });
  });

  it('[Mutation > login] returns expected data', async () => {
    const SAMPLE_LOGIN_MUTATION = gql`
      mutation login {
        login(email: "a@a.a")
      }
    `;

    // TODO: execute the mutation
    // TODO: check the response
    fail();
  });
});
