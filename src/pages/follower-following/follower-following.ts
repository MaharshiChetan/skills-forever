import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'follower-following-page',
  templateUrl: 'follower-following.html',
})
export class FollowerFollowingPage {
  followerKeys = [];
  followingKeys = [];
  followers = [];
  following = [];
  type;
  followerLoader: any = '';
  followingLoader: any = '';
  followerLoadingText: string;
  followingLoadingText: string;

  usersdata = firebase.database().ref('/users');

  constructor(private navCtrl: NavController, private navParams: NavParams) {}

  ionViewWillEnter() {
    this.followerKeys = this.navParams.get('followers');
    this.followingKeys = this.navParams.get('followings');
    this.type = this.navParams.get('type');

    if (this.type === 'Dropers') {
      this.initializeFollowersLoader();
      this.fetchFollowers();
    } else if (this.type === 'Droping') {
      this.initializeFollowingLoader();
      this.fetchFollowings();
    }
  }

  initializeFollowersLoader() {
    this.followerLoader =
      this.followers.length >= this.followerKeys.length ? 'false' : '';
    this.followerLoadingText =
      this.followers.length >= this.followerKeys.length
        ? 'Completed'
        : 'Loading more users...';
  }

  initializeFollowingLoader() {
    this.followingLoader =
      this.following.length >= this.followingKeys.length ? 'false' : '';
    this.followingLoadingText =
      this.following.length >= this.followingKeys.length
        ? 'Completed'
        : 'Loading more users...';
  }

  fetchFollowers() {
    return new Promise((resolve, reject) => {
      for (let i = this.followers.length; i < this.followers.length + 10; i++) {
        this.initializeFollowersLoader();
        if (i >= this.followerKeys.length) {
          break;
        }
        this.usersdata
          .child(`${this.followerKeys[i].key}/personalData`)
          .once('value', snapshot => {
            this.followers.push(snapshot.val());
          })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      }
    });
  }

  fetchFollowings() {
    return new Promise((resolve, reject) => {
      for (let i = this.following.length; i < this.following.length + 10; i++) {
        this.initializeFollowingLoader();
        if (i >= this.followingKeys.length) {
          break;
        }
        this.usersdata
          .child(`${this.followingKeys[i].key}/personalData`)
          .once('value', snapshot => {
            this.following.push(snapshot.val());
          })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      }
    });
  }

  doInfinite(infiniteScroll) {
    console.log(this.type, ' 1');

    if (this.type === 'Dropers') {
      this.fetchFollowers()
        .then(() => {
          infiniteScroll.complete();
        })
        .catch(() => {
          alert('Something went wrong');
        });
    } else if (this.type === 'Droping') {
      this.fetchFollowings()
        .then(() => {
          infiniteScroll.complete();
        })
        .catch(() => {
          alert('Something went wrong');
        });
    }
  }

  goToProfilePage(user) {
    if (firebase.auth().currentUser.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { user: user });
    }
  }
}
