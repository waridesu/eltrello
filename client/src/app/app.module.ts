import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from "./components/auth/services/auth.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './components/auth/components/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AuthInterceptor } from "./components/auth/services/auth.interceptor";
import { BoardsComponent } from './components/boards/components/boards/boards.component';
import { BoardComponent } from './components/boards/components/boards/board/board.component';
import { SocketService } from "./shared/services/socket.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BoardsComponent,
    BoardComponent,
  ],
  providers: [AuthService, SocketService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
