import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatProvider {
  constructor(private db: AngularFireDatabase) {}

  sendMessage(senderId, receiverId, message) {
    this.db.list(`chats/${senderId}/${receiverId}/messages`).push({
      message: message,
      sentBy: senderId,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${senderId}/${receiverId}`).update({
      message: message,
      sentBy: senderId,
      timeStamp: '' + new Date(),
    });
    this.db.list(`chats/${receiverId}/${senderId}/messages`).push({
      message: message,
      sentBy: senderId,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${receiverId}/${senderId}`).update({
      message: message,
      sentBy: senderId,
      timeStamp: '' + new Date(),
    });
  }

  deleteMessage(senderId, receiverId, messageId) {
    this.db
      .list(`chats/${senderId}/${receiverId}/messages/${messageId}`)
      .remove();
    this.db
      .list(`chats/${receiverId}/${senderId}/messages/${messageId}`)
      .remove();
  }

  deleteAllMessages(senderId, receiverId) {
    this.db.list(`chats/${senderId}/${receiverId}/messages`).remove();
    this.db.list(`displayChats/${senderId}/${receiverId}`).remove();
  }

  getDisplayMessages(senderId) {
    return this.db
      .list(`displayChats/${senderId}`, ref => ref.orderByChild('timeStamp'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      );
  }

  getMessages(senderId, receiverId) {
    return this.db
      .list(`chats/${senderId}/${receiverId}/messages`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      );
  }
}
