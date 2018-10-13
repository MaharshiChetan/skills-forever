import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsPage } from './event-details';
import { HideFabOnscrollModule } from 'ionic-hide-fab-onscroll';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [EventDetailsPage],
  imports: [
    HideFabOnscrollModule,
    MomentModule,
    IonicPageModule.forChild(EventDetailsPage),
  ],
})
export class EventDetailsPageModule {}
