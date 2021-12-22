import { UsersService } from './users.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private usersSub: Subscription = new Subscription();
  isLoading: boolean = false;
  users: User[];
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getUsers();
    this.isLoading = true;
    this.usersSub = this.usersService
      .getUsersUpdatedListener()
      .subscribe((userData: { users: User[] }) => {
        this.isLoading = false;
        this.users = userData.users;
      });
  }

  onDelete(userId: string) {
    this.isLoading = true;
    this.usersService.deletePost(userId).subscribe(() => {
      this.usersService.getUsers();
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
