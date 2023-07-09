import { Component, OnInit } from '@angular/core';
import { AuthService } from "./components/auth/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
title = 'client';

  constructor(private authSvc: AuthService) { }
  ngOnInit() {
    this.authSvc.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.authSvc.setCurrentUser(currentUser);
      },
      error: (err) => {
        console.log(err);
        this.authSvc.setCurrentUser(null);
      }
    })
  }
}
