import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { User } from "../user";


@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit {

  private users:Array<User> = new Array<User>();

  constructor(private chatService: ChatService) {
    (chatService.users).subscribe(
      users => {
        this.users = users;
      }
    );

  }

  ngOnInit() {
  }

  findUserById(id: String): User {
    return this.users.find(function(user: User) {
      if(user.id === id) {
        return true;
      }
      return false;
    });
  }

  get currentUser(): User {
    return this.findUserById(this.currentUserId);
  }

  get currentUserId(): String {
    return this.chatService.currentUserId;
  }

  updateUsername($event): void {
    // console.log($event.target.value);
    if($event.target.value === "") {
      $event.target.value = this.currentUser.name;
    } else {
      const n = $event.target.value;
      this.chatService.updateUsername(n);
    }
  }

  empty($event): void {
    $event.target.value = "";
  }

  onKeyUpEnter($event): void {
    $event.preventDefault();
    $event.target.blur();
  }

}
