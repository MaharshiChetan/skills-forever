import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';
import 'rxjs/add/operator/debounceTime';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'chat-list-page',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  loader;
  searchTerm;
  loadingText;
  displayMessages;
  usersdata = firebase.database().ref('/users');
  subscription: any;
  searchMessages;
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private chatService: ChatProvider,
    private dataService: DataProvider
  ) {}

  ionViewWillEnter() {
    this.getDisplayMessages();
    this.initializeLoader();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  initializeLoader() {
    // this.loader = this.users.length >= this.userKeys.length ? 'false' : '';
    // this.loadingText =
    //   this.displayMessages.length >= this.userKeys.length
    //     ? 'Completed'
    //     : 'Loading more chats...';
  }

  getDisplayMessages() {
    this.subscription = this.chatService
      .getDisplayMessages(firebase.auth().currentUser.uid)
      .subscribe(displayMessages => {
        this.displayMessages = _.sortBy(displayMessages, function(o) {
          return moment(o['timeStamp']);
        }).reverse();

        this.displayMessages.forEach((data, i) => {
          this.usersdata
            .child(`${data.key}/personalData`)
            .once('value', snapshot => {
              this.displayMessages[i].userDetails = snapshot.val();
            });
        });
        this.searchMessages = this.displayMessages;
      });
  }

  fetchDisplayMessages(refresh) {
    this.getDisplayMessages();
    refresh.complete();
  }

  deleteAllMessages(message) {
    this.chatService.deleteAllMessages(
      firebase.auth().currentUser.uid,
      message.key
    );
  }

  doInfinite(infiniteScroll) {
    /* this.fetchUsers()
      .then(() => {
        infiniteScroll.complete();
      })
      .catch(() => {
        alert('Something went wrong');
      }); */
  }

  presentPopover(message) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Take action');

    alert.addInput({
      type: 'radio',
      label: 'Delete',
      value: 'delete',
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'delete') {
          this.deleteAllMessages(message);
        }
      },
    });
    alert.present();
  }

  goToChatPage(user) {
    this.navCtrl.push('OneToOneChatPage', { userDetails: user });
  }

  setFilteredItems(event) {
    this.displayMessages = this.dataService.filterItems(
      this.searchMessages,
      this.searchTerm
    );
  }
}
