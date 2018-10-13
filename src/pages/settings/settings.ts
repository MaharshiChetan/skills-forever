import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    private authService: AuthProvider,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  logout() {
    const loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging Out',
    });
    loader.present();

    this.authService.logout();
    loader.dismiss();

    this.navCtrl.setRoot('LoginPage');
  }
  dismiss() {
    this.view.dismiss();
  }
}
