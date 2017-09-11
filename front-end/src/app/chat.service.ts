import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'
import * as io from 'socket.io-client';
import { Message } from './message';
import { User } from "./user";
import { UserMessage } from './user-message';
import { SystemMessage } from './system-message';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChatService {

  private socketUrl:String = environment.socketServer;
  private socket:any;
  private messageSubject:BehaviorSubject<Message> = new BehaviorSubject<Message>(new SystemMessage("Welcome to the chat"));
  private usersSubject:BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>(new Array<User>());

  constructor() {
    this.socket = io(this.socketUrl);

    this.socket.on('new user', (input) => {
      const message = new SystemMessage(input.body);
      this.messageSubject.next(message);
    });

    this.socket.on('chat message', (input) => {
      const message = new UserMessage(input.user, input.body);
      this.messageSubject.next(message);
    });

    this.socket.on('user list', (input) => {
      this.usersSubject.next(input.users);
    });

    this.socket.on('user left', (input) => {
      const message = new SystemMessage(`User "${input.user.name}" has left`);
      this.messageSubject.next(message);
    });

  }

  get messages(): BehaviorSubject<Message> {
    return this.messageSubject;
  }

  get users(): BehaviorSubject<Array<User>> {
    return this.usersSubject;
  }

  get currentUserId(): String {
    return this.socket.id;
  }

  sendMessage(messageBody: String): void {
    this.socket.emit('chat message', messageBody);
  }

  updateUsername(username: String): void {
    this.socket.emit('user update', username);
  }

}
