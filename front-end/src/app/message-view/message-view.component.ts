import { Component, OnInit } from '@angular/core';
import { Message } from "../message";
import { ChatService } from "../chat.service";

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements OnInit {

  private messages = new Array<Message>();

  constructor(private chatService: ChatService) {
    (chatService.messages).subscribe(
      message => {
        this.messages.push(message);
      }
    );
  }

  ngOnInit() {
  }

  addMessage(message: Message): void {
    this.messages.push(message);
  }

}
