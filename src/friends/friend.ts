import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Friend {
  @Field()
  name: string;

  @Field()
  surname: string;
}
