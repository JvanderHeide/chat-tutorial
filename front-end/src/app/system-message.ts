import { Message } from "./message";

export class SystemMessage implements Message {
  message: String;
  timestamp: Number;

  constructor(message: String, timestamp: Number = Date.now()) {
    this.message = message;
    this.timestamp = timestamp;
  }

}
