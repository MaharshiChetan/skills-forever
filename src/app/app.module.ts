import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { CameraProvider } from '../providers/camera/camera';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EventsProvider } from '../providers/events/events';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { config } from './app.firebase';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Message } from '../providers/message/message';
import { FollowProvider } from '../providers/follow/follow';
import { PostProvider } from '../providers/post/post';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { ChatProvider } from '../providers/chat/chat';
import { Clipboard } from '@ionic-native/clipboard';
import { DataProvider } from '../providers/data/data';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicImageViewerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GooglePlus,
    Facebook,
    Network,
    Camera,
    SocialSharing,
    InAppBrowser,
    FileTransfer,
    File,

    AuthProvider,
    CameraProvider,
    EventsProvider,
    Message,
    FollowProvider,
    PostProvider,
    ImageLoaderConfig,
    ChatProvider,
    Clipboard,
    DataProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
