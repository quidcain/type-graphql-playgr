import { ObjectType, Query } from "type-graphql";
import { Friend } from "./friend";
import { friendsDao } from "./friends.dao";

@ObjectType()
export class FriendsResolver {
  @Query(() => [Friend])
  friends() {
    return friendsDao.getFriends();
  }
}
