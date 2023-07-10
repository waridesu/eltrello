import { Injectable } from '@angular/core';
import { ICurrentUser } from "../../components/auth/types/current-user.interface";
import { io, Socket } from "socket.io-client";
import { environment } from "../../../environment/environments";
@Injectable()
export class SocketService {
  socket: Socket | undefined;

  constructor() { }
  setSocket(currentUser: ICurrentUser): void {
    this.socket = io(environment.socketUrl, { auth: { token: currentUser.token }})
  }
  emit(event: string, message: unknown): void {
    if (!this.socket) {
      throw new Error('Socket is not defined');
    }
    this.socket.emit(event, message);
  }
  disconnect(): void {
    if (!this.socket) {
      throw new Error('Socket is not defined');
    }
    this.socket.disconnect();
  }
}
