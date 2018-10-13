import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersLikesPage } from './users-likes';

@NgModule({
  declarations: [
    UsersLikesPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersLikesPage),
  ],
})
export class UsersLikesPageModule {}
