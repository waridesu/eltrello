import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authSvc.isLogged$.pipe(map(isLogged => {
      if (isLogged) {
        return true;
      }
      this.router?.navigateByUrl('/');
      return false;
    }));
  }
}
