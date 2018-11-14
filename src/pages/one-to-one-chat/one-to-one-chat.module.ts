import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OneToOneChatPage } from './one-to-one-chat';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [OneToOneChatPage],
  imports: [MomentModule, IonicPageModule.forChild(OneToOneChatPage)],
})
export class OneToOneChatPageModule {}
