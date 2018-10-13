import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OneToOneChatPage } from './one-to-one-chat';
import { MomentModule } from 'ngx-moment';
import { HideFabOnscrollModule } from 'ionic-hide-fab-onscroll';

@NgModule({
  declarations: [OneToOneChatPage],
  imports: [
    MomentModule,
    HideFabOnscrollModule,
    IonicPageModule.forChild(OneToOneChatPage),
  ],
})
export class OneToOneChatPageModule {}
