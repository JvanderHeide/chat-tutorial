import { Message } from "./message";
import { User } from "./user";

export class UserMessage implements Message {
  message: String;
  timestamp: Number;
  user: User;

  constructor(user: User, message: String, timestamp: Number = Date.now()) {
    this.message = message;
    this.timestamp = timestamp;
    this.user = user;
  }
}
