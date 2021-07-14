
 
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { FriendsResolver } from "./friends/resolver";
import { buildSchema } from "type-graphql";
import { stringifySchema } from "./printSchema";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { AuthorizedDirective } from "./authorizedDirective";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [FriendsResolver],
  });

  SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
    authorized: AuthorizedDirective,
  });

  const schemaString = stringifySchema(schema);
  console.log(schemaString);

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
