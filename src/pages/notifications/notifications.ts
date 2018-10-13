import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'notifications-page',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  constructor(public navCtrl: NavController) {}
}
