import { Component, HostListener, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { PostProvider } from '../../providers/post/post';
import { Message } from '../../providers/message/message';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'create-post-page',
  templateUrl: 'create-post.html',
})
export class CreatePostPage {
  image: string;
  showAlertMessage = true;
  event = {
    name: undefined,
    id: undefined,
  };
  imageStore;
  post;
  textualContent;
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private element: ElementRef,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private db: AngularFireDatabase,
    private postService: PostProvider,
    private presentMessage: Message,
    private imageViewerCtrl: ImageViewerController
  ) {}

  ionViewWillEnter() {
    this.post = this.navParams.get('post');
    this.image = this.navParams.get('image');
    this.event.name = this.navParams.get('eventName');
    this.event.id = this.navParams.get('eventId');
  }

  ionViewCanLeave() {
    if (this.showAlertMessage) {
      let alertPopup = this.alertCtrl.create({
        title: 'Discard Post?',
        message: "This post won't be saved.",
        buttons: [
          {
            text: 'Discard Post',
            handler: () => {
              alertPopup.dismiss().then(() => {
                this.exitPage();
              });
              return false;
            },
          },
          {
            text: 'Cancel',
            handler: () => {},
          },
        ],
      });
      alertPopup.present();
      return false;
    }
  }

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.pop();
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
    textArea.style.height = textArea.scrollHeight + 5 + 'px';
  }

  presentImage(myImage) {
    this.imageViewerCtrl.create(myImage).present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }
  createPost(text) {
    const loader = this.loadingCtrl.create();
    loader.present();

    if (this.image) {
      let imageId = this.db.createPushId();

      this.imageStore = firebase
        .storage()
        .ref('/eventPostsImages')
        .child(`${this.event.id}/${imageId}`);
      this.imageStore.putString(this.image, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          const post = {
            textualContent: text.value,
            imageUrl: url,
            imageId: imageId,
          };

          this.postService.createEventPost(post, this.event.id).then(res => {
            loader.dismiss();
            this.presentMessage.showToast(
              'Successfully created a post!',
              'success-toast'
            );
            this.showAlertMessage = false;
            this.navCtrl.pop();
          });
        });
      });
    } else {
      const post = {
        textualContent: text.value,
        imageUrl: null,
        imageId: null,
      };
      this.postService.createEventPost(post, this.event.id).then(res => {
        loader.dismiss();
        this.presentMessage.showToast(
          'Successfully created a post!',
          'success-toast'
        );
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    }
  }

  updatePost(text) {
    const loader = this.loadingCtrl.create();
    loader.present();

    if (this.post.imageUrl) {
      let imageId = this.post.imageId;

      const post = {
        textualContent: text.value,
        imageUrl: this.post.imageUrl,
        imageId: imageId,
      };
      this.postService
        .updateEventPost(post, this.event.id, this.post.key)
        .then(res => {
          loader.dismiss();
          this.presentMessage.showToast(
            'Successfully updated a post!',
            'success-toast'
          );
          this.showAlertMessage = false;
          this.navCtrl.pop();
        });
    } else {
      const post = {
        textualContent: text.value,
        imageUrl: null,
        imageId: null,
      };
      this.postService
        .updateEventPost(post, this.event.id, this.post.key)
        .then(res => {
          loader.dismiss();
          this.presentMessage.showToast(
            'Successfully updated a post!',
            'success-toast'
          );
          this.showAlertMessage = false;
          this.navCtrl.pop();
        });
    }
  }
}
