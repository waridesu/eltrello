import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn: Subscription | undefined;

  constructor(private authSvc: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authSvc.isLogged$.subscribe(isLogged => {
      if (isLogged) {
        this.router.navigateByUrl('/boards');
      }
    });
  }

  ngOnDestroy() {
    this.isLoggedIn?.unsubscribe();
  }
}
