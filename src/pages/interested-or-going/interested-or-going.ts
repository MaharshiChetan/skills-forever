import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'interested-or-going-page',
  templateUrl: 'interested-or-going.html',
})
export class InterestedOrGoingPage {
  interestedUsersKeys = [];
  goingUsersKeys = [];
  interestedUsers = [];
  goingUsers = [];
  type;
  interestedLoader: any = '';
  goingLoader: any = '';
  interestedLoadingText: string;
  goingLoadingText: string;

  usersdata = firebase.database().ref('/users');

  constructor(private navCtrl: NavController, private navParams: NavParams) {}

  ionViewWillEnter() {
    this.interestedUsersKeys = this.navParams.get('interestedUsers');
    this.goingUsersKeys = this.navParams.get('goingUsers');
    this.type = this.navParams.get('type');
    if (this.type === 'interested') {
      this.initializeInterestedLoader();
      this.fetchInterestedUsers();
    } else if (this.type === 'going') {
      this.initializeGoingLoader();
      this.fetchGoingUsers();
    }
  }

  initializeInterestedLoader() {
    this.interestedLoader =
      this.interestedUsers.length >= this.interestedUsersKeys.length
        ? 'false'
        : '';
    this.interestedLoadingText =
      this.interestedUsers.length >= this.interestedUsersKeys.length
        ? 'Completed'
        : 'Loading more users...';
  }

  initializeGoingLoader() {
    this.goingLoader =
      this.goingUsers.length >= this.goingUsersKeys.length ? 'false' : '';
    this.goingLoadingText =
      this.goingUsers.length >= this.goingUsersKeys.length
        ? 'Completed'
        : 'Loading more users...';
  }

  fetchInterestedUsers() {
    return new Promise((resolve, reject) => {
      for (
        let i = this.interestedUsers.length;
        i < this.interestedUsers.length + 10;
        i++
      ) {
        this.initializeInterestedLoader();
        if (i >= this.interestedUsersKeys.length) {
          break;
        }
        this.usersdata
          .child(`${this.interestedUsersKeys[i].key}/personalData`)
          .once('value', snapshot => {
            this.interestedUsers.push(snapshot.val());
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

  fetchGoingUsers() {
    return new Promise((resolve, reject) => {
      for (
        let i = this.goingUsers.length;
        i < this.goingUsers.length + 10;
        i++
      ) {
        this.initializeGoingLoader();
        if (i >= this.goingUsersKeys.length) {
          break;
        }
        this.usersdata
          .child(`${this.goingUsersKeys[i].key}/personalData`)
          .once('value', snapshot => {
            this.goingUsers.push(snapshot.val());
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

    if (this.type === 'interested') {
      this.fetchInterestedUsers()
        .then(() => {
          infiniteScroll.complete();
        })
        .catch(() => {
          alert('Something went wrong');
        });
    } else if (this.type === 'going') {
      this.fetchGoingUsers()
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
