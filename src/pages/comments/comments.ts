import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
} from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { Message } from '../../providers/message/message';

@IonicPage()
@Component({
  selector: 'comments-page',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  @ViewChild('content')
  content: any;

  post: any;
  eventId: string;
  comments: any;
  usersdata = firebase.database().ref('/users');
  currentUserDetails;
  commentText;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private element: ElementRef,
    private postService: PostProvider,
    private authService: AuthProvider,
    private alertCtrl: AlertController,
    private presentMessage: Message
  ) {}

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300); //300ms animation speed
    }, 800);
  }

  ionViewDidLoad() {
    this.fetchCurrentUserProfile();
    this.post = this.navParams.get('post');
    this.eventId = this.navParams.get('eventId');
    this.getAllComments(this.post.key, this.eventId);
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  ngAfterViewInit() {
    this.adjust();
  }

  adjust(): void {
    let textArea = this.element.nativeElement.getElementsByTagName(
      'textarea'
    )[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 1 + 'px';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetchCurrentUserProfile() {
    this.authService.getUserDetails().then(user => {
      this.currentUserDetails = user;
    });
  }

  getAllComments(postKey: string, eventId: string) {
    this.postService.getAllComments(postKey, eventId).subscribe(comments => {
      this.comments = comments;
      this.comments.forEach((comment, i) => {
        this.usersdata
          .child(`${comment.uid}/personalData`)
          .once('value', snapshot => {
            this.comments[i].userDetails = snapshot.val();
          });
      });
      this.scrollToBottom();
    });
  }

  createComment(comment) {
    if (comment.value === '') {
      return this.presentMessage.showToast('Enter some comment!', 'fail-toast');
    }
    this.postService.createComment(
      this.post.key,
      this.eventId,
      firebase.auth().currentUser.uid,
      comment.value
    );
    this.commentText = '';
  }

  presentPopover(postId, eventId, commentId, uid) {
    if (uid === firebase.auth().currentUser.uid) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Take action');

      alert.addInput({
        type: 'radio',
        label: 'Delete',
        value: 'delete',
      });
      alert.addInput({
        type: 'radio',
        label: 'Edit',
        value: 'edit',
      });

      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          if (data === 'delete') {
            this.postService.deleteComment(postId, eventId, commentId);
          }
        },
      });
      alert.present();
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
