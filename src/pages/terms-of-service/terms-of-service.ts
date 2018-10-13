import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'terms-of-service-page',
  templateUrl: 'terms-of-service.html',
})
export class TermsOfServicePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsOfServicePage');
  }
  dismiss() {
    this.view.dismiss();
  }
}
