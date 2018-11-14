import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'notifications-page',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  constructor(public navCtrl: NavController, private tabsPage: TabsPage) {}

  ionViewWillEnter() {
    this.tabsPage.showFabButton();
  }
}
