import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage {
  events: any[];
  subscription: any;
  animate: boolean = true;
  loaded;
  placeholderImage = 'assets/placeholder.jpg';
  constructor(
    public navCtrl: NavController,
    private eventService: EventsProvider
  ) {}

  ionViewWillEnter() {
    this.fetchEvents(null);
  }

  ionViewDidLeave() {
    this.animate = false;
  }

  fetchEvents(refresher) {
    this.subscription = this.eventService.fetchEvents().subscribe(events => {
      this.events = events.reverse();
      if (refresher) refresher.complete();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  goToEventDetails(event) {
    this.navCtrl.push('EventDetailsPage', { event: event });
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  goToCreateEvent() {
    this.navCtrl.push('CreateEventPage');
  }
}
