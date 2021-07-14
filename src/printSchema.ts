import { GraphQLSchema, lexicographicSortSchema } from "graphql";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

export function stringifySchema(schema: GraphQLSchema): string {
  const schemaToEmit = lexicographicSortSchema(schema);
  return printSchemaWithDirectives(schemaToEmit);
}
