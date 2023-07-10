import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { SocketService } from "../../../../shared/services/socket.service";

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMassage: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
              private authSvc: AuthService,
              private router: Router,
              private socket: SocketService) {}

  onSubmit(): void {
    const {email, password} = this.form.value;
    if (!email || !password) return;

    this.authSvc.login({email, password}).subscribe({
      next: (currentUser) => {
        console.log(currentUser);
        this.authSvc.setToken(currentUser);
        this.socket.setSocket(currentUser);
        this.authSvc.setCurrentUser(currentUser);
        this.errorMassage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error);
        this.errorMassage = err.error.emailOrPassword;
      }
    });

    console.log("onSubmit", this.form.value);
  }
}
