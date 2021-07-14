export class FriendsDao {
  private friends = [
    { name: 'Roma', surname: 'Labatkin' },
    { name: 'Max', surname: 'Kulik' },
  ];

  getFriends() {
    return this.friends;
  }
}

export const friendsDao = new FriendsDao();
