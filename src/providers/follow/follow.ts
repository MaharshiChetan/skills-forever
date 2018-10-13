import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class FollowProvider {
  constructor(private db: AngularFireDatabase) {}

  getFollowers(userId: string) {
    // Used to build the follower count
    return this.db
      .list(`followers/${userId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  getFollowings(userId: string) {
    // Used to build the following count
    return this.db
      .list(`following/${userId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  getFollowing(followerId: string, followedId: string) {
    // Used to see if UserOne if following UserTwo
    return this.db
      .object(`following/${followerId}/${followedId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.payload.val()));
  }

  follow(followerId: string, followedId: string) {
    this.db.object(`followers/${followedId}`).update({ [followerId]: true });
    this.db.object(`following/${followerId}`).update({ [followedId]: true });
  }

  unfollow(followerId: string, followedId: string) {
    this.db.object(`followers/${followedId}/${followerId}`).remove();
    this.db.object(`following/${followerId}/${followedId}`).remove();
  }
}
