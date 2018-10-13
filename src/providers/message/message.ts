import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';

@Injectable()
export class Message {
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  showToast(message: string, cssClass?: string, duration?: number) {
    return this.toastCtrl
      .create({
        message: message,
        position: 'top',
        duration: duration || 2000,
        cssClass: cssClass,
      })
      .present();
  }

  showAlert(title, subTitle, backdrop?: boolean) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK'],
      enableBackdropDismiss: backdrop || false,
    });
    alert.present();
  }
}
