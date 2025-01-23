import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import { USERS } from "./user.js";

import { TODOS } from "./todo.js";

const typeDefs = `
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String!
    website: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean
    user: User
  }

  type Query {
    getTodos: [Todo]
    getAllUsers: [User]
    getUser(id: ID!): User
  }
`;

const resolvers = {
  Todo: {
    user: (todo) => USERS.find((e) => e.id === todo.id),
  },
  Query: {
    getTodos: () => TODOS,
    getAllUsers: () => USERS,
    getUser: (_, { id }) => USERS.find((e) => e.id === id),
  },
};

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Server started at PORT 8000"));
}

startServer();
