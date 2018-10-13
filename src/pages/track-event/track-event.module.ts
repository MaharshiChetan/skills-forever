import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackEventPage } from './track-event';

@NgModule({
  declarations: [
    TrackEventPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackEventPage),
  ],
})
export class TrackEventPageModule {}
