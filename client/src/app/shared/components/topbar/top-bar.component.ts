import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from "../../../components/auth/services/auth.service";

@Component({
  selector: 'top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  imports: [
    RouterLink
  ]
})
export class TopBarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router?.navigateByUrl('/');
  }
}
