import { createYoga, createSchema } from 'graphql-yoga';

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello World!',
      },
    },
  }),
  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',
  
  // Yoga needs to know how to create a valid HTTP response
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST };
