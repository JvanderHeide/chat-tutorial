import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MessageViewComponent } from './message-view/message-view.component';
import { ChatService } from './chat.service';

@NgModule({
  declarations: [
    AppComponent,
    MessageViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
