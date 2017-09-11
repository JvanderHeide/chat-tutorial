import { Message } from "./message";

export class UserMessage implements Message {
  message: String;
  timestamp: Number;
  username: String;

  constructor(username: String, message: String) {
    this.message = message;
    this.timestamp = Date.now();
    this.username = username;
  }
}
