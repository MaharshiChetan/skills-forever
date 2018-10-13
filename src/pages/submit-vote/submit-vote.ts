import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
} from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { EventsProvider } from '../../providers/events/events';
import { Message } from '../../providers/message/message';

@IonicPage()
@Component({
  selector: 'submit-vote-page',
  templateUrl: 'submit-vote.html',
})
export class SubmitVotePage {
  showcases = [];
  key;
  votingForm: FormGroup;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private eventService: EventsProvider,
    private loadingCtrl: LoadingController,
    private presentMessage: Message
  ) {
    console.log(this.navParams.get('showcases'));

    this.navParams.get('showcases').map((showcase, id) => {
      this.showcases.push({ showcaseDetail: showcase, id: id });
    });

    this.key = this.navParams.get('key');
    this.createForm();
  }

  createForm() {
    this.votingForm = new FormGroup({
      showcaseId: new FormControl({ value: this.showcases, disabled: false }),
    });
  }

  submit() {
    console.log(this.votingForm.value);

    const event = {
      key: this.key,
      showcaseId: this.votingForm.value.showcaseId,
    };

    const loading = this.loadingCtrl.create();
    loading.present();
    this.eventService.submitVote(event);
    loading.dismiss();
    this.presentMessage.showToast(
      `Successfully voted to JUDGE: ${
        this.showcases[event.showcaseId].showcaseDetail.name
      }`,
      'success-toast'
    );

    this.navCtrl.popToRoot();
  }
}
