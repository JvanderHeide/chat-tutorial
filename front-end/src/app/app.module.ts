import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { MessageViewComponent } from './message-view/message-view.component';
import { ChatService } from './chat.service';
import { MessageWriterComponent } from './message-writer/message-writer.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageViewComponent,
    MessageWriterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
