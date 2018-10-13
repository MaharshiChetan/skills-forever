import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  ModalController,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'register-page',
  templateUrl: 'register.html',
})
export class RegisterPage {
  register: FormGroup;
  name: string;
  username: string;
  email: string;
  password: string;
  passwordconfirm: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modal: ModalController
  ) {
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  createForm() {
    this.register = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  emailRegister() {
    var loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Creating Account',
    });
    const { name, username, email } = this.trimValues();
    if (name && username && email) {
      loader.present();
      this.authService
        .registerWithEmail(email, this.password, name, username)
        .then(res => {
          loader.dismiss();
          if (res === true) {
            this.navCtrl.setRoot('TabsPage');
          } else if (res === 'verify') {
            this.toastCtrl
              .create({
                message: 'Verify your email before logging in',
                position: 'top',
                duration: 2000,
                cssClass: 'fail-toast',
              })
              .present();
            this.navCtrl.setRoot('LoginPage');
          } else {
            this.toastCtrl
              .create({
                message: 'There was an error. Please try again',
                position: 'top',
                duration: 2000,
                cssClass: 'fail-toast',
              })
              .present();
          }
        })
        .catch(err => {
          loader.dismiss();
          this.toastCtrl
            .create({
              message: 'There was an error. Please try again',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
          console.error(err);
        });
    }
  }

  googleRegister() {
    var loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging In',
    });
    loader.present();
    this.authService
      .registerWithGoogle()
      .then(res => {
        if (res === true) {
          loader.dismiss();
          this.navCtrl.setRoot('TabsPage');
        } else if (res === 'email') {
          loader.dismiss();
          this.toastCtrl
            .create({
              message: 'This Email Already Exists',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        } else {
          loader.dismiss();
          this.toastCtrl
            .create({
              message: 'Please Try Again',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        }
      })
      .catch(err => {
        loader.dismiss();
        this.toastCtrl
          .create({
            message: 'There was an error. Please try again',
            position: 'top',
            duration: 2000,
            cssClass: 'fail-toast',
          })
          .present();
        console.error(err);
      });
  }

  facebookRegister() {
    var loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging In',
    });
    loader.present();
    this.authService
      .registerWithFacebook()
      .then(res => {
        if (res === true) {
          loader.dismiss();
          this.navCtrl.setRoot('TabsPage');
        } else if (res === 'email') {
          loader.dismiss();
          this.toastCtrl
            .create({
              message: 'This Email Already Exists',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        } else {
          loader.dismiss();
          this.toastCtrl
            .create({
              message: 'Please Try Again',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        }
      })
      .catch(err => {
        loader.dismiss();
        this.toastCtrl
          .create({
            message: 'There was an error. Please try again',
            position: 'top',
            duration: 2000,
            cssClass: 'fail-toast',
          })
          .present();
        console.error(err);
      });
  }
  goToLogin() {
    this.navCtrl.pop();
  }

  showTermsModal() {
    let modal = this.modal.create('TermsOfServicePage');
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create('PrivacyPolicyPage');
    modal.present();
  }

  trimValues() {
    if (this.username && this.name && this.email) {
      return {
        name: this.name.trim(),
        username: this.username.trim(),
        email: this.email.trim(),
      };
    } else {
      return {
        name: null,
        username: null,
        email: null,
      };
    }
  }
}
