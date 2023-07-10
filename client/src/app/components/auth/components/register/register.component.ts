import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { SocketService } from "../../../../shared/services/socket.service";

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errorMassage: string | null = null;
  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder,
              private authSvc: AuthService,
              private router: Router,
              private socket: SocketService) {
  }

  onSubmit(): void {
    const {email, username, password} = this.form.value;
    if (!email || !username || !password) return;

    this.authSvc.register({email, username, password}).subscribe({
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
        this.errorMassage = err.error.join(', ');
      }
    });

    console.log("onSubmit", this.form.value);
  }
}
