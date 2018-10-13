import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root: string = 'EventsPage';
  tab2Root: string = 'ProfilePage';
  tab3Root: string = 'NotificationsPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}
}
