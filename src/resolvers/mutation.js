/* TODO: Implement the resolvers for Mutation

Remember the resolver function signature:
fieldName: (obj, args, context, info) => result;

Check models/movie for the data fetching functions you'll need to complete the exercise.
Refer to your schema if you're unsure what to return from the resolvers.

For toggleLike, only authenticated users can toggle a like. Try grabbing the user
off the context and throw an error if there is no user.

Good luck!
*/

module.exports = {
  Mutation: {
    toggleLike: () => null,
    login: (_, { email }) => new Buffer(email).toString('base64'),
  },
};
