// src/index.ts (Classic Apollo Server Express)
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { DoctorResolver } from "./resolvers/doctor.resolver";
import { Application } from "express";

async function bootstrap() {
  // Build TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [DoctorResolver],
    emitSchemaFile: true,
    validate: false,
  });

  // Create Express app
  const app = express();

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    formatError: (formattedError) => {
      console.error("GraphQL Error:", formattedError);
      return formattedError;
    },
  });

  await server.start();
  
  // Apply middleware with type casting to avoid typescript error
  server.applyMiddleware({ 
    app: app as any, 
    path: '/graphql' 
  });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(console.error);