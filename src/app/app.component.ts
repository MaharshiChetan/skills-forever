import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  ToastController,
  NavController,
  MenuController,
  AlertController,
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { config } from './app.firebase';
import firebase from 'firebase';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Message } from '../providers/message/message';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: string = '';
  isAuthenticated = false;
  @ViewChild('nav')
  nav: NavController;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public network: Network,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private presentMessage: Message
  ) {
    //INITIALIZES FIREBASE WITH THE APP
    firebase.initializeApp(config);

    this.storage
      .get('user')
      .then(val => {
        if (val) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'LoginPage';
        }
      })
      .catch(err => {
        this.rootPage = 'LoginPage';
      });

    //KEEPS CHECKING NETWORK CONNECTIVITY AND ALERTS USER IF DISCONNECTED
    this.network.onchange().subscribe(networkChange => {
      if (networkChange.type === 'online') {
        this.presentMessage.showToast('Back Online', 'toastonline');
      } else if (networkChange.type === 'offline') {
        const alert = this.alertCtrl.create({
          title: 'Connection Failed!',
          subTitle:
            'There may be a problem in your internet connection. Please try again !',
          buttons: ['OK'],
          enableBackdropDismiss: true,
        });
        alert.present();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLogout() {
    let alertPopup = this.alertCtrl.create({
      title: 'Log out of Skillz-Forever?',
      message: 'You have to login again, once you have logout.',
      buttons: [
        {
          text: 'Log Out',
          handler: () => {
            alertPopup.dismiss().then(() => {
              this.storage.remove('user');
              this.nav.setRoot('LoginPage');
              this.menuCtrl.close();
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
  }
  goToCreateEvent() {
    this.nav.push('CreateEventPage');
    this.menuCtrl.close();
  }

  goToMyEvents() {
    this.nav.push('MyEventsPage');
    this.menuCtrl.close();
  }

  goToChatListPage() {
    this.nav.push('ChatListPage');
    this.menuCtrl.close();
  }
}
