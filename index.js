import { ApolloServer } from 'apollo-server';
import Resources from './ressources';
import utils from './utils';

require('dotenv').config();

const { resolvers, typeDefs } = utils;

const config = {
  API_KEY: process.env.API_KEY
}

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  dataSources: () => ({
    api: new Resources(config),
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
