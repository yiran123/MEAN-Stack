import { User } from './user.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[] }>();
  baseUrl: string = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  getUsers() {
    this.http
      .get<{ users: any }>(this.baseUrl)
      .pipe(
        map((userData) => {
          return {
            users: userData.users.map((user: any) => {
              return {
                id: user._id,
                email: user.email,
                userRole: user.userRole,
              };
            }),
          };
        })
      )
      .subscribe((transformedUsersData) => {
        this.users = transformedUsersData.users;
        this.usersUpdated.next({
          users: [...this.users],
        });
      });
  }

  getUsersUpdatedListener() {
    return this.usersUpdated.asObservable();
  }

  deletePost(userId: string) {
    return this.http.delete([this.baseUrl, userId].join('/'));
  }
}
