import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  AlertController,
} from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ChatProvider } from '../../providers/chat/chat';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { Clipboard } from '@ionic-native/clipboard';
import { Message } from '../../providers/message/message';

@IonicPage()
@Component({
  selector: 'one-to-one-chat-page',
  templateUrl: 'one-to-one-chat.html',
})
export class OneToOneChatPage {
  @ViewChild(Content)
  content: Content;
  otherUserDetails: any;
  messages: any;
  messageForm: FormGroup;
  chatBox: string;
  currentUserDetails;
  chatSubscription: any;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private chatService: ChatProvider,
    private authService: AuthProvider,
    private alertCtrl: AlertController,
    private clipboard: Clipboard,
    private presentMessage: Message
  ) {}

  ionViewWillEnter() {
    this.otherUserDetails = this.navParams.get('userDetails');
    this.authService.getUserDetails().then(userDetails => {
      this.currentUserDetails = userDetails;
      this.fetchMessages();
    });
  }

  fetchMessages() {
    this.chatSubscription = this.chatService
      .getMessages(this.currentUserDetails.uid, this.otherUserDetails.uid)
      .subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      });
  }

  ionViewWillLeave() {
    this.chatSubscription.unsubscribe();
  }
  createForm() {
    this.messageForm = this.formBuilder.group({
      message: new FormControl(''),
    });
    this.chatBox = '';
  }

  send() {
    if (this.chatBox && this.chatBox.trim().length > 0) {
      this.chatService.sendMessage(
        this.currentUserDetails.uid,
        this.otherUserDetails.uid,
        this.chatBox.trim()
      );
    }
    this.scrollToBottom();
    this.chatBox = '';
  }

  deleteMessage(messageId) {
    this.chatService.deleteMessage(
      this.currentUserDetails.uid,
      this.otherUserDetails.uid,
      messageId
    );
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 200);
  }

  presentPopover(message) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Take action');

    alert.addInput({
      type: 'radio',
      label: 'Delete',
      value: 'delete',
    });

    alert.addInput({
      type: 'radio',
      label: 'Copy',
      value: 'copy',
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'delete') {
          console.log(message);

          this.deleteMessage(message.key);
        } else if (data === 'copy') {
          console.log(message.message);

          this.clipboard.copy(message.message);
          this.presentMessage.showToast('Text copied to clipboard!');
        }
      },
    });
    alert.present();
  }

  goToProfilePage(user) {
    if (firebase.auth().currentUser.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { user: user });
    }
  }
}
