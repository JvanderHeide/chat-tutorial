import { Message } from "./message";

export class SystemMessage implements Message {
  message: String;
  timestamp: Number;

  constructor(message: String) {
    this.message = message;
    this.timestamp = Date.now();
  }

}
