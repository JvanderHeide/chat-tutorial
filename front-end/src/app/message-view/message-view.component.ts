import { Component, AfterViewChecked, ElementRef } from '@angular/core';
import { Message } from "../message";
import { ChatService } from "../chat.service";

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements AfterViewChecked {

  private messages:Array<Message> = new Array<Message>();
  private allowScrolling:Boolean = false;

  constructor(private chatService: ChatService, private elRef:ElementRef) {
    (chatService.messages).subscribe(
      message => {
        this.messages.push(message);
        this.allowScrolling = true;
      }
    );
  }

  ngAfterViewChecked() {
    this.scrollInToView();
  }


  scrollInToView(): void {
    if(this.allowScrolling) {
      this.elRef.nativeElement.scrollTop = this.elRef.nativeElement.scrollHeight;
      this.allowScrolling = false;
    }
  }

  addMessage(message: Message): void {
    this.messages.push(message);
  }

  get currentUserId(): String {
    return this.chatService.currentUserId;
  }

}
