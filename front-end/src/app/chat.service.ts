import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'
import * as io from 'socket.io-client';
import { Message } from './message';
import { UserMessage } from './user-message';
import { SystemMessage } from './system-message';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChatService {

  private socketUrl:String = environment.socketServer;
  private socket:any = null;
  private messageSubject:BehaviorSubject<Message> = new BehaviorSubject<Message>(new SystemMessage("Welcome to the chat"));

  constructor() {
    this.socket = io(this.socketUrl);

    this.socket.on('new user', (input) => {
      const message = new SystemMessage(input.body);
      this.messageSubject.next(message);
    });

    this.socket.on('chat message', (input) => {
      const message = new UserMessage(input.username, input.body);
      this.messageSubject.next(message);
    });

  }

  get messages() {
    return this.messageSubject;
  }

}
