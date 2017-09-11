import { Message } from "./message";

export class UserMessage implements Message {
  message: String;
  timestamp: Number;
  username: String;

  constructor(username: String, message: String, timestamp: Number = Date.now()) {
    this.message = message;
    this.timestamp = timestamp;
    this.username = username;
  }
}
