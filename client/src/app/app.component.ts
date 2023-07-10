import { Component, OnInit } from '@angular/core';
import { AuthService } from "./components/auth/services/auth.service";
import { SocketService } from "./shared/services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
title = 'client';

  constructor(private authSvc: AuthService, private socketSvc: SocketService) { }
  ngOnInit() {
    this.authSvc.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.socketSvc.setSocket(currentUser);
        this.authSvc.setCurrentUser(currentUser);
      },
      error: (err) => {
        console.log(err);
        this.authSvc.setCurrentUser(null);
      }
    })
  }
}
