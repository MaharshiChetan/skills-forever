import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root: string = 'EventsPage';
  tab2Root: string = 'ExplorePage';
  tab3Root: string = 'NotificationsPage';
  tab4Root: string = 'ProfilePage';
  hide = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}

  show() {
    console.log('hello');
  }

  hideFabButton() {
    this.hide = true;
  }

  showFabButton() {
    this.hide = false;
  }
}
