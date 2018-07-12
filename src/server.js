require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const isEmail = require("isemail");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const IMDB = require("./datasources/IMDB");
const LikesDB = require("./datasources/LikesDB");

const config = {
  port: 3000
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    imdb: new IMDB(),
    likes: new LikesDB()
  }),
  context: ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || "";
    const email = new Buffer(auth, "base64").toString("ascii");

    return {
      user: isEmail.validate(email) ? email : null
    };
  }
});

// Start our server with our port config
server
  .listen({ port: config.port })
  .then(({ url }) => console.log(`🚀 app running at ${url}`));
