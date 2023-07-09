import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable } from "rxjs";
import { ICurrentUser } from "../types/current-user.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environment/environments";
import { IRegisterRequest } from "../types/register-request.interface";
import { ILoginRequest } from "../types/login-request.interface";

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<ICurrentUser | null | undefined>(undefined);
  isLogged$ = this.currentUser$.pipe(
    filter(currentUser => currentUser !== undefined),
    map(Boolean));

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<ICurrentUser> {
    const url = environment.apiUrl + "/user";
    return this.http.get<ICurrentUser>(url);
  }

  register(registerRequest: IRegisterRequest): Observable<ICurrentUser> {
    const url = environment.apiUrl + "/users";
    return this.http.post<ICurrentUser>(url, registerRequest);
  }
  login(loginRequest: ILoginRequest): Observable<ICurrentUser> {
    const url = environment.apiUrl + "/users/login";
    return this.http.post<ICurrentUser>(url, loginRequest);
  }
  setToken(currentUser: ICurrentUser): void {
    localStorage.setItem('token', currentUser.token);
  }
  setCurrentUser(currentUser: ICurrentUser | null): void {
    this.currentUser$.next(currentUser);
  }
}
