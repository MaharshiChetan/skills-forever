import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  Content,
  LoadingController,
  FabContainer,
  AlertController,
  ActionSheetController,
  ModalController,
} from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AuthProvider } from '../../providers/auth/auth';
import { EventsProvider } from '../../providers/events/events';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Message } from '../../providers/message/message';
import { Platform } from 'ionic-angular/platform/platform';
import { CameraProvider } from '../../providers/camera/camera';
import { PostProvider } from '../../providers/post/post';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage implements OnInit {
  @ViewChild(Content)
  content: Content;

  fileTransfer: FileTransferObject = this.transfer.create();
  start = 0;
  threshold = 100;
  usersdata = firebase.database().ref('/users');
  slideHeaderPrevious = 0;
  ionScroll: any;
  showheader: boolean;
  hideheader: boolean;
  headercontent: any;
  bookingTitle: string = 'Book';
  posts: any;
  userDetails: any = [];
  event;
  interested = false;
  going = false;
  interestedSubscription;
  goingSubscription;
  interestedCount;
  interestedUsers;
  goingUsers;
  goingCount;
  loaded = false;
  isLiking: boolean = false;
  uid = this.authService.getActiveUser().uid;

  currentUserDetails: any;
  type = 'about';
  showMore: boolean = false;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private myElement: ElementRef,
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthProvider,
    private eventService: EventsProvider,
    private socialSharing: SocialSharing,
    private transfer: FileTransfer,
    private file: File,
    private presentMessage: Message,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private cameraService: CameraProvider,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private postService: PostProvider,
    private modalCtrl: ModalController
  ) {
    this.showheader = false;
    this.hideheader = true;
    this.event = this.navParams.get('event');
  }

  ionViewWillEnter() {
    this.fetchCurrentUserProfile();

    this.interestedSubscription = this.eventService
      .fetchInterestedOrGoingUsers(this.event.key, 'interested')
      .subscribe(users => {
        this.interestedUsers = users;
        this.interestedCount = users.length;
        this.checkInterest(users);
      });
    this.goingSubscription = this.eventService
      .fetchInterestedOrGoingUsers(this.event.key, 'going')
      .subscribe(users => {
        this.goingUsers = users;
        this.goingCount = users.length;
        this.checkGoing(users);
      });
  }

  ionViewWillLeave() {
    this.interestedSubscription.unsubscribe();
    this.goingSubscription.unsubscribe();
  }

  checkInterest(interestedUsers) {
    interestedUsers.forEach(user => {
      if (user.key === this.uid) this.interested = true;
    });
  }

  checkGoing(goingUsers) {
    goingUsers.forEach(user => {
      if (user.key === this.uid) this.going = true;
    });
  }

  fetchCurrentUserProfile() {
    this.authService.getUserDetails().then(user => {
      this.currentUserDetails = user;
    });
  }

  ngOnInit() {
    // Ionic scroll element
    this.ionScroll = this.myElement.nativeElement.getElementsByClassName(
      'scroll-content'
    )[0];
    // On scroll function
    this.ionScroll.addEventListener('scroll', () => {
      if (this.ionScroll.scrollTop - this.start > this.threshold) {
        this.showheader = true;
        this.hideheader = false;
      } else {
        this.showheader = false;
        this.hideheader = true;
      }
      if (this.slideHeaderPrevious >= this.ionScroll.scrollTop - this.start) {
        this.showheader = false;
        this.hideheader = true;
      }
      this.slideHeaderPrevious = this.ionScroll.scrollTop - this.start;
    });
  }

  presentImage(myImage) {
    this.imageViewerCtrl.create(myImage).present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  goToSubmitVotePage() {
    this.navCtrl.push('SubmitVotePage', {
      showcases: this.event.eventShowcases,
      key: this.event.key,
    });
  }

  goToReviewsPage() {
    this.navCtrl.push('ReviewsPage');
  }

  handleInterestedOrGoing(eventKey, type) {
    this.authService.getUserDetails().then(user => {
      try {
        this.eventService.handleInterestOrGoing(eventKey, user, type);
        if (type === 'interested') this.interested = !this.interested;
        if (type === 'going') this.going = !this.going;
      } catch (e) {
        alert(e);
      }
    });
  }

  shareOnWhatsApp(fab: FabContainer) {
    fab.close();
    const loading = this.createLoading();
    loading.present();
    this.fileTransfer
      .download(
        this.event.eventImage,
        this.file.dataDirectory + 'this.event.eventName' + '.jpeg'
      )
      .then(image => {
        loading.dismiss();
        this.socialSharing
          .shareViaWhatsApp(
            `*Event Name*:- ${this.event.eventName}\n*Event Description*:- ${
              this.event.eventDescription
            }\n`,
            image.toURL()
          )
          .then(data => {
            loading.dismiss();
            if (data) {
              this.incrementShare();
            }
          })
          .catch(error => {
            loading.dismiss();
          });
      })
      .catch(e => {
        loading.dismiss();
      });
  }

  shareOnInstagram(fab: FabContainer) {
    fab.close();
    const loading = this.createLoading();
    loading.present();
    this.presentMessage.showAlert(
      'Hint!',
      'Event details are copied just paste in your instagram post.'
    );
    this.fileTransfer
      .download(
        this.event.eventImage,
        this.file.dataDirectory + 'this.event.eventName' + '.jpeg'
      )
      .then(image => {
        loading.dismiss();
        this.socialSharing
          .shareViaInstagram(
            `*Event Name:-* ${this.event.eventName}\n*Event Description:-* ${
              this.event.eventDescription
            }`,
            image.toURL()
          )
          .then(data => {
            loading.dismiss();
            if (data) {
              this.incrementShare();
            }
          })
          .catch(error => {
            alert(error);
            loading.dismiss();
          });
      })
      .catch(e => {
        loading.dismiss();
      });
  }

  goToInterestedOrGoingUsersPage(type) {
    this.navCtrl.push('InterestedOrGoingPage', {
      interestedUsers: this.interestedUsers,
      goingUsers: this.goingUsers,
      type: type,
    });
  }

  incrementShare() {
    this.authService.getUserDetails().then(user => {
      this.eventService.incrementShare(this.event.key, user);
    });
  }

  createLoading() {
    return this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
    });
  }

  bookTicket() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Participation fees');

    this.event.eventCategories.forEach(category => {
      alert.addInput({
        type: 'radio',
        label: `${category.name}  -  Rs.${category.price}`,
        value: category,
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
      },
    });
    alert.present();
  }

  fetchDiscussionPosts() {
    this.postService.getEventPosts(this.event.key).subscribe(eventPosts => {
      this.posts = eventPosts.reverse();
      this.posts.forEach((post, i) => {
        this.usersdata
          .child(`${post.uid}/personalData`)
          .once('value', snapshot => {
            this.posts[i].userDetails = snapshot.val();
            if (post.uid === firebase.auth().currentUser.uid) {
              this.posts[i].myPost = true;
            }
            this.postService
              .getTotalLikes(post.key, this.event.key)
              .subscribe(likes => {
                if (this.posts.length > 0) {
                  this.posts[i].likes = likes;
                  this.posts[i].totalLikes = likes.length;
                }
              });
            this.postService
              .getTotalComments(post.key, this.event.key)
              .subscribe(comments => {
                if (this.posts.length > 0) {
                  this.posts[i].totalComments = comments.length;
                }
              });
            this.postService
              .checkLike(
                post.key,
                firebase.auth().currentUser.uid,
                this.event.key
              )
              .subscribe(data => {
                if (data.key && this.posts.length > 0) {
                  this.posts[i].isLiking = true;
                } else if (this.posts.length > 0) {
                  this.posts[i].isLiking = false;
                }
              });
          });
      });
    });
  }

  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload Picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera Roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromCamera(false).then(
      picture => {
        if (picture) {
          const quality =
            6 < parseFloat(this.cameraService.getImageSize(picture))
              ? 0.5
              : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            const image =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', {
              image: image,
              eventName: this.event.eventName,
              eventId: this.event.key,
            });
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  getPicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromPhotoLibrary(false).then(
      picture => {
        if (picture) {
          const quality =
            6 < parseFloat(this.cameraService.getImageSize(picture))
              ? 0.5
              : 0.8;

          this.cameraService.generateFromImage(picture, quality, data => {
            const image =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', {
              image: image,
              eventName: this.event.eventName,
              eventId: this.event.key,
            });
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  createPost() {
    let alertPopup = this.alertCtrl.create({
      title: 'Attach photo?',
      message: 'Would you like to attached one photo with your post?',
      buttons: [
        {
          text: 'Yes, attach photo',
          handler: () => {
            this.changePicture();
          },
        },
        {
          text: 'No, Just text',
          handler: () => {
            this.navCtrl.push('CreatePostPage', {
              eventName: this.event.eventName,
              eventId: this.event.key,
            });
          },
        },
      ],
    });
    alertPopup.present();
  }

  doInfinite(infinite) {}

  goToProfilePage(user) {
    if (firebase.auth().currentUser.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { user: user });
    }
  }

  like(post) {
    this.postService.likeEventPost(
      post.key,
      firebase.auth().currentUser.uid,
      this.event.key
    );
  }

  unlike(post) {
    this.postService.unlikeEventPost(
      post.key,
      firebase.auth().currentUser.uid,
      this.event.key
    );
  }

  openCommentsModal(post, eventId) {
    const modal = this.modalCtrl.create('CommentsPage', {
      post: post,
      eventId: eventId,
    });
    modal.present();
  }

  presentPopover(post, eventId) {
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
          this.postService.deletePost(post, eventId);
        } else if (data === 'edit') {
          this.navCtrl.push('CreatePostPage', {
            eventName: this.event.eventName,
            eventId: eventId,
            post: post,
          });
        }
      },
    });
    alert.present();
  }

  changeContentLength() {
    this.showMore = !this.showMore;
  }

  showUsers(users) {
    this.navCtrl.push('UsersLikesPage', { users: users, type: 'Likes' });
  }
}
