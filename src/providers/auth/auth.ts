import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
// import { SQLite } from '@ionic-native/sqlite';
import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class AuthProvider {
  uid: any = null;
  query: any;
  usersdata = firebase.database().ref('/users');

  constructor(
    public http: HttpClient,
    private googlePlus: GooglePlus,
    private storage: Storage,
    // private sqlite: SQLite,
    private facebook: Facebook
  ) {
    this.storage
      .get('user')
      .then(res => {
        this.uid = res;
      })
      .catch(err => {
        console.error(err);
      });
  }

  registerWithEmail(email, password, name, username) {
    return new Promise(resolve => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(res => {
              let userdata = JSON.parse(JSON.stringify(response));
              this.updateUser(
                userdata.uid,
                name,
                username,
                'https://profile.actionsprout.com/default.jpeg'
              )
                .then(res => {
                  if (res === true) {
                    this.loginwithEmail(email, password)
                      .then(res => {
                        if (res === true) {
                          resolve(true);
                        } else if (res === 'verify') {
                          resolve('verify');
                        } else if (res === 'password') {
                          resolve('password');
                        } else {
                          resolve(false);
                        }
                      })
                      .catch(err => {
                        resolve(false);
                        console.error(err);
                      });
                  } else {
                    this.deleteAccount()
                      .then(res => {
                        resolve(false);
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              console.error(err);
              this.deleteAccount()
                .then(res => {
                  resolve(false);
                })
                .catch(err => {
                  console.error(err);
                });
            });
        })
        .catch(err => {
          console.error(err);
          resolve('email');
        });
    });
  }

  loginwithEmail(email, password) {
    return new Promise(resolve => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          let userdata = JSON.parse(JSON.stringify(response));

          if (userdata.user.emailVerified === true) {
            this.setLoginKey(userdata.user.uid)
              .then(res => {
                console.log(res);
                resolve(true);
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          } else {
            resolve('verify');
          }
        })
        .catch(err => {
          if (err.code === 'auth/wrong-password') {
            resolve('password');
          } else {
            console.error(err.code);
            resolve(false);
          }
        });
    });
  }

  webGoogleLogin(): Promise<boolean> {
    return new Promise(resolve => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(res => {
          console.log(res);
          resolve(true);
        })
        .catch(err => {
          resolve(false);
          console.error(err);
        });
    });
  }

  registerWithGoogle() {
    return new Promise(resolve => {
      this.googlePlus
        .login({
          webClientId:
            '766344988044-rq4ldcpfb22dggipn58a03te59nhen25.apps.googleusercontent.com',
          offline: true,
        })
        .then(res => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(
            null,
            res.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(googleCredential)
            .then(response => {
              let userdata = JSON.parse(JSON.stringify(response));
              this.updateUser(
                userdata.uid,
                userdata.displayName,
                userdata.email.substring(0, userdata.email.lastIndexOf('@')),
                userdata.photoURL
              )
                .then(res => {
                  if (res === true) {
                    this.setLoginKey(userdata.uid)
                      .then(res => {
                        resolve(true);
                      })
                      .catch(err => {
                        console.error(
                          'There is an error setting login key' + err
                        );
                        this.deleteAccount()
                          .then(res => {
                            resolve(false);
                          })
                          .catch(err => {
                            console.error(err);
                          });
                      });
                  } else {
                    this.deleteAccount()
                      .then(res => {
                        resolve(false);
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              console.error(err);
              resolve('email');
            });
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  registerWithFacebook() {
    return new Promise(resolve => {
      this.facebook
        .login(['public_profile', 'user_friends', 'email'])
        .then(response => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
            response.authResponse.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(facebookCredential)
            .then(response => {
              let userdata = JSON.parse(JSON.stringify(response));
              this.updateUser(
                userdata.uid,
                userdata.displayName,
                'NOUSERNAME',
                userdata.photoURL
              )
                .then(res => {
                  if (res === true) {
                    this.setLoginKey(userdata.uid)
                      .then(res => {
                        resolve(true);
                      })
                      .catch(err => {
                        console.error(
                          'There is an error setting login key' + err
                        );
                        this.deleteAccount()
                          .then(res => {
                            resolve(false);
                          })
                          .catch(err => {
                            console.error(err);
                          });
                      });
                  } else {
                    this.deleteAccount()
                      .then(res => {
                        resolve(false);
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              resolve('email');
              console.error(err);
            });
        })
        .catch(err => {
          resolve(false);
          console.error(err);
        });
    });
  }

  setLoginKey(uid) {
    return new Promise(resolve => {
      this.storage
        .set('user', uid)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .catch(err => {
          console.error(err);
        });
      this.storage.remove('user');
      this.googlePlus.logout().catch(err => {
        console.error(err);
      });
      this.facebook.logout().catch(err => {
        console.error(err);
      });
    });
  }

  updateUser(uid, name, username, profilePhoto) {
    return new Promise(resolve => {
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: name,
          photoURL: profilePhoto,
        })
        .then(res => {
          this.usersdata
            .child(firebase.auth().currentUser.uid)
            .child('personalData')
            .set({
              uid: firebase.auth().currentUser.uid,
              displayName: name,
              userName: username,
              profilePhoto: profilePhoto,
            })
            .then(res => {
              resolve(true);
            })
            .catch(err => {
              console.error(err);
              resolve(false);
            });
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  getUserDetails() {
    return new Promise(resolve => {
      this.storage
        .get('user')
        .then(res => {
          this.usersdata
            .child(`${res}/personalData`)
            .once('value', snapshot => {
              resolve(snapshot.toJSON());
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  deleteAccount() {
    return new Promise(resolve => {
      firebase
        .auth()
        .currentUser.delete()
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          resolve(false);
          console.error(err);
        });
    });
  }

  incrementUserEventParticipation(eventKey, type) {
    this.usersdata.child(`events/${type}/${eventKey}`).set({
      eventKey: eventKey,
    });
  }

  decrementUserEventParticipation(eventKey, type) {
    this.usersdata.child(`events/${type}/${eventKey}`).remove();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }
}
