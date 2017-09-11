import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";

@Component({
  selector: 'app-message-writer',
  templateUrl: './message-writer.component.html',
  styleUrls: ['./message-writer.component.scss']
})
export class MessageWriterComponent implements OnInit {

  private message:String = "";
  private placeholder:String = "Type your message..."

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
  }

  canSend(): Boolean {
    return (this.message.length > 0);
  }

  submitMessage(): void {
    if(this.canSend()) {
      this.chatService.sendMessage(this.message);
    }
    this.message = "";
  }

}
