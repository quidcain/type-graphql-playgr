import { ApolloError } from "apollo-server-errors";
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLInputField,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLString,
} from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";

export class AuthorizedDirective extends SchemaDirectiveVisitor {
  visitObject(type: GraphQLObjectType): GraphQLObjectType | void | null {
    this.ensureFieldsWrapped(type);
    (type as any)._requiredAuthRole = this.args.requires;
  }

  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(
    field: GraphQLField<any, any>,
    details: {
      objectType: GraphQLObjectType | GraphQLInterfaceType;
    },
  ): GraphQLField<any, any> | void | null {
    this.ensureFieldsWrapped(details.objectType);
    (field as any)._requiredAuthRole = this.args.requires;
  }

  visitInputFieldDefinition(
    field: GraphQLInputField,
  ): GraphQLInputField | void | null {
    return field;
  }

  ensureFieldsWrapped(
    objectType: GraphQLObjectType | GraphQLInterfaceType,
  ): void {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if ((objectType as any)._authFieldsWrapped) return;
    (objectType as any)._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          (field as any)._requiredAuthRole ||
          (objectType as any)._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        const user = context.user;
        if (!user.roles.includes(requiredRole)) {
          throw new ApolloError("not authorized");
        }

        return resolve.apply(this, args);
      };
    });
  }

  static getDirectiveDeclaration(
    name: string,
  ) {
    return new GraphQLDirective({
      name,
      locations: [
        DirectiveLocation.FIELD_DEFINITION,
        DirectiveLocation.INPUT_FIELD_DEFINITION,
        DirectiveLocation.OBJECT,
      ],
      args: {
        requires: {
          type: GraphQLString,
          defaultValue: 'admin',
        }
      }
    });
  }
}
