import { AuthData } from './auth-data.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL: string = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private userRole: string;
  private userId: string;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<string>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserRole() {
    return this.userRole;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, userRole: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      userRole: userRole,
    };
    //console.log(authData);
    this.http.post([BACKEND_URL, 'signup'].join('/'), authData).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.authStatusListener.next(null);
      },
    });
  }

  login(email: string, password: string, userRole: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      userRole: userRole,
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userRole: string;
        userId: string;
      }>([BACKEND_URL, 'login'].join('/'), authData)
      .subscribe({
        next: (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.userRole = response.userRole;
            this.userId = response.userId;
            this.isAuthenticated = true;
            this.authStatusListener.next(this.userRole);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            //console.log(this.userId);
            this.saveAuthData(
              token,
              expirationDate,
              this.userRole,
              this.userId
            );
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.authStatusListener.next(null);
        },
      });
  }

  autoAuthUser() {
    const authInfomation = this.getAuthData();
    if (!authInfomation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfomation.expirationDate.getTime() - now.getTime();
    //console.log(authInfomation);
    if (expiresIn > 0) {
      this.token = authInfomation.token;
      this.isAuthenticated = true;
      this.userId = authInfomation.userId;
      this.userRole = authInfomation.userRole;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(this.userRole);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.userRole = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userRole: string,
    userId: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !userRole) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userRole: userRole,
      userId: userId,
    };
  }
}
