import { Component, OnInit } from '@angular/core';
import { Message } from "../message";
import { SystemMessage } from "../system-message";

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements OnInit {

  messages = new Array<Message>();

  constructor() { }

  ngOnInit() {
    this.addMessage(new SystemMessage("Welcome to the chat"));
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

}
