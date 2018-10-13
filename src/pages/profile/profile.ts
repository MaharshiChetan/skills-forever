import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  ModalController,
  Content,
  Platform,
  ActionSheetController,
  NavParams,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ElementRef } from '@angular/core';
import { CameraProvider } from '../../providers/camera/camera';
import { ImageViewerController } from 'ionic-img-viewer';
import firebase from 'firebase';
import { Message } from '../../providers/message/message';
import { FollowProvider } from '../../providers/follow/follow';

@IonicPage()
@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  @ViewChild(Content)
  content: Content;
  start = 0;
  dropParentButton = 'post';
  threshold = 100;
  usersdata = firebase.database().ref('/users');
  slideHeaderPrevious = 0;
  ionScroll: any;
  showheader: boolean;
  hideheader: boolean;
  drop = false;
  headercontent: any;
  userDetails: any;
  chosenPicture: string;

  followerCount: number;
  followingCount: number;
  isFollowing: boolean = false;
  followers;
  followings;

  animate: boolean = true;

  isFollowingSubscription;
  followerSubscription;
  followingSubscription;

  posts = [
    {
      postImageUrl: 'assets/flying_machine.jpg',
      text: `I believe in being strong when everything seems to be going wrong.
             I believe that happy girls are the prettiest girls.
             I believe that tomorrow is another day and I believe in miracles.`,
      date: 'November 5, 2016',
      likes: 12,
      comments: 4,
      timestamp: '11h ago',
    },
  ];
  otherUser;
  currentUser;
  user = {
    tweets: 1,
  };

  constructor(
    private navCtrl: NavController,
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthProvider,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private myElement: ElementRef,
    private cameraService: CameraProvider,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private navParams: NavParams,
    private presentMessage: Message,
    private followService: FollowProvider
  ) {
    this.showheader = false;
    this.hideheader = true;
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

  ionViewDidLeave() {
    this.animate = false;
  }

  ionViewWillEnter() {
    this.otherUser = this.navParams.get('user');
    this.currentUser = this.navParams.get('currentUser');

    if (this.otherUser) {
      this.userDetails = this.otherUser;
      this.checkFollowingAndFollower();
    } else if (this.currentUser) {
      this.userDetails = this.currentUser;
      this.checkFollowingAndFollower();
    } else {
      this.fetchCurrentUserProfile(null);
    }
  }

  ionViewWillLeave() {
    this.followerSubscription.unsubscribe();
    this.followingSubscription.unsubscribe();
    if (this.isFollowingSubscription) {
      this.isFollowingSubscription.unsubscribe();
    }
  }

  checkFollowingAndFollower() {
    this.fetchFollowings();
    this.fetchFollowers();
    this.getFollowing();
  }

  fetchUserProfile(refresher) {
    this.usersdata
      .child(`${this.userDetails.uid}/personalData`)
      .once('value', snapshot => {
        this.userDetails = snapshot.val();
        console.log(this.userDetails);
        refresher.complete();
      });
    if (refresher) refresher.complete();
  }

  getFollowing() {
    this.isFollowingSubscription = this.followService
      .getFollowing(firebase.auth().currentUser.uid, this.userDetails.uid)
      .subscribe(data => {
        if (data) {
          this.isFollowing = true;
        } else {
          this.isFollowing = false;
        }
      });
  }

  fetchFollowings() {
    this.followingSubscription = this.followService
      .getFollowings(this.userDetails.uid)
      .subscribe(followings => {
        this.followingCount = followings.length;
        this.followings = followings;
      });
  }

  fetchFollowers() {
    this.followerSubscription = this.followService
      .getFollowers(this.userDetails.uid)
      .subscribe(followers => {
        this.followerCount = followers.length;
        this.followers = followers;
      });
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
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
    return this.cameraService.getPictureFromCamera(true).then(
      picture => {
        if (picture) {
          const quality =
            6 < parseFloat(this.cameraService.getImageSize(picture))
              ? 0.5
              : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', { image: this.chosenPicture });
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
    return this.cameraService.getPictureFromPhotoLibrary(true).then(
      picture => {
        if (picture) {
          const quality =
            6 < parseFloat(this.cameraService.getImageSize(picture))
              ? 0.5
              : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              this.cameraService.getImageSize(picture) >
              this.cameraService.getImageSize(data)
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', { image: this.chosenPicture });
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  fetchCurrentUserProfile(refresher) {
    this.authService.getUserDetails().then(user => {
      this.userDetails = user;
      this.fetchFollowings();
      this.fetchFollowers();
      if (refresher) refresher.complete();
    });
  }

  editUserProfile() {
    if (this.userDetails.uid === firebase.auth().currentUser.uid) {
      this.navCtrl.push('EditProfilePage', { userDetails: this.userDetails });
    }
  }

  logout() {
    this.authService.logout();
  }

  goToSettingsModal() {
    const modal = this.modalCtrl.create('SettingsPage');
    modal.present();
  }

  goToOneToOneChatPage(userDetails) {
    this.navCtrl.push('OneToOneChatPage', { userDetails: userDetails });
  }

  follow() {
    this.followService.follow(
      firebase.auth().currentUser.uid,
      this.userDetails.uid
    );
    this.presentMessage.showToast(
      `You have given a drop to ${this.userDetails.userName}`,
      'success-toast'
    );
  }

  unfollow() {
    this.followService.unfollow(
      firebase.auth().currentUser.uid,
      this.userDetails.uid
    );
    this.presentMessage.showToast(
      `You have taken away a drop from ${this.userDetails.userName}`,
      'success-toast'
    );
  }

  goToFollowerFollowingPage(type) {
    this.navCtrl.push('FollowerFollowingPage', {
      followings: this.followings,
      followers: this.followers,
      type: type,
    });
  }
}
