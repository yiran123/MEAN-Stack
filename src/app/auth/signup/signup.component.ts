import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { AuthData } from './../auth-data.interface';
import { NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authStatusSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        if (authStatus === null) {
          this.isLoading = false;
        }
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      form.value.email,
      form.value.password,
      form.value.userRole
    );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
