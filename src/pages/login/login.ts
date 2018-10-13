import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import {
  LoadingController,
  IonicPage,
  NavController,
  ToastController,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: FormGroup;
  email: any;
  password: any;
  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthProvider
  ) {
    this.createForm();
  }

  createForm() {
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  loginWithEmail() {
    const loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging In',
    });
    loader.present();
    this.authService
      .loginwithEmail(this.email.trim(), this.password)
      .then(res => {
        loader.dismiss();
        console.log(res);
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
        } else if (res === 'password') {
          this.toastCtrl
            .create({
              message: 'Please check login details',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
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

  // doGoogleLogout(){
  //   let env = this;

  //   this.googleLoginService.doGoogleLogout()
  //   .then(function(res) {
  //     env.user = new GoogleUserModel();
  //   }, function(error){
  //     console.log("Google logout error", error);
  //   });
  // }

  // doGoogleLogin() {
  //   let env = this;

  //   this.googleLoginService.doGoogleLogin()
  //   .then(function(user){
  //     env.user = user;
  //   }, function(err){
  //     console.log("Google Login error", err);
  //   });
  // }

  googleLogin() {
    const loader = this.loadingCtrl.create({
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

  facebookLogin() {
    const loader = this.loadingCtrl.create({
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
  goToSignup() {
    this.navCtrl.push('RegisterPage');
  }
}
