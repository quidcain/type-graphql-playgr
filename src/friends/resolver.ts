import { Directive, ObjectType, Query } from "type-graphql";
import { Friend } from "./friend";
import { friendsDao } from "./friends.dao";

@ObjectType()
export class FriendsResolver {
  @Query(() => [Friend])
  @Directive("@authorized(requires: Admin)")
  friends() {
    return friendsDao.getFriends();
  }
}
