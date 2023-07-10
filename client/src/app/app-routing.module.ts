import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "./components/auth/components/register/register.component";
import { LoginComponent } from "./components/auth/components/login/login.component";
import { HomeComponent } from "./components/home/components/home/home.component";
import { AuthGuard } from "./components/auth/services/auth.guard";
import { AuthService } from "./components/auth/services/auth.service";
import { BoardsComponent } from "./components/boards/components/boards/boards.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'boards/:id', loadComponent: () =>
      import('./components/boards/components/boards/board/board.component').then((m) => m.BoardComponent),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthService, AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
