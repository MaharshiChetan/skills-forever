import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class EventsProvider {
  eventData: any = firebase.database().ref('/events');
  imageStore = firebase.storage().ref('/eventImages');

  constructor(private db: AngularFireDatabase) {}

  createEvent(event, eventImage, imageId) {
    try {
      return this.db.list('events').push({
        uid: firebase.auth().currentUser.uid,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventState: event.eventState,
        eventCity: event.eventCity,
        eventPrice: event.eventPrice,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        startDateAndTime: event.startDateAndTime,
        endDateAndTime: event.endDateAndTime,
        eventShowcases: event.eventShowcases,
        eventImage: eventImage,
        imageId: imageId,
        eventCategories: event.eventCategories,
      });
    } catch (e) {
      console.log(e);
    }
  }
  updateEvent(event, eventImage, key, imageId) {
    try {
      return this.db.object(`events/${key}`).update({
        uid: firebase.auth().currentUser.uid,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventState: event.eventState,
        eventCity: event.eventCity,
        eventPrice: event.eventPrice,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        startDateAndTime: event.startDateAndTime,
        endDateAndTime: event.endDateAndTime,
        eventShowcases: event.eventShowcases,
        eventImage: eventImage,
        imageId: imageId,
        eventCategories: event.eventCategories,
      });
    } catch (e) {
      console.log(e);
    }
  }

  fetchEvents() {
    try {
      return this.db
        .list('events')
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
        );
    } catch (e) {
      console.log(e);
    }
  }

  deleteEvent(event) {
    try {
      this.imageStore
        .child(`${firebase.auth().currentUser.uid}/${event.imageId}`)
        .delete()
        .then(() => {
          this.eventData.child(event.key).remove();
        });
    } catch (e) {
      return e;
    }
  }

  submitVote(event) {
    try {
      this.eventData
        .child(`${event.key}/eventShowcases/${event.showcaseId}`)
        .once('value', snapshot => {
          return this.db
            .object(`events/${event.key}/eventShowcases/${event.showcaseId}`)
            .update({
              totalVotes: snapshot.val().totalVotes + 1,
            });
        });
    } catch (e) {
      return e;
    }
  }

  fetchInterestedOrGoingUsers(eventKey, type) {
    try {
      return this.db
        .list(`events/${eventKey}/${type}/users`)
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
        );
    } catch (e) {
      console.log(e);
    }
  }

  async handleInterestOrGoing(eventKey, user, type) {
    let check = true;
    try {
      await this.eventData
        .child(`${eventKey}/${type}/users`)
        .once('value', snapshot => {
          if (!snapshot.val()) {
            this.incrementInterestOrGoing(eventKey, user, type);
          } else {
            snapshot.forEach(childSnapshot => {
              if (childSnapshot.key === user.uid) {
                this.decrementInterestOrGoing(eventKey, user, type);
                check = false;
              }
            });
          }
        });
      if (check) {
        this.incrementInterestOrGoing(eventKey, user, type);
      }
    } catch (e) {
      return e;
    }
  }

  incrementInterestOrGoing(eventKey, user, type) {
    try {
      this.eventData.child(`${eventKey}/${type}/users/${user.uid}`).set({
        uid: user.uid,
      });
    } catch (e) {
      return e;
    }
  }

  decrementInterestOrGoing(eventKey, user, type) {
    try {
      this.eventData.child(`${eventKey}/${type}/users/${user.uid}`).remove();
    } catch (e) {
      return e;
    }
  }

  async incrementShare(eventKey, user) {
    try {
      await this.eventData.child(`${eventKey}/shares/users/${user.uid}`).set({
        uid: user.uid,
      });
    } catch (e) {
      return e;
    }
  }
}
