import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IBoard } from "../types/board.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environments";
import { SocketService } from "./socket.service";
import { SocketEventsEnum } from "../types/socket-events.enum";

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  constructor(private http: HttpClient, private socket: SocketService) {}

  getBoards(): Observable<IBoard[]> {
    const url = environment.apiUrl + '/boards';
    return this.http.get<IBoard[]>(url);
  }

  createBoard(title: string): Observable<IBoard> {
    const url = environment.apiUrl + '/boards';
    return this.http.post<IBoard>(url, { title });
  }

  getBoard(boardId: string): Observable<IBoard> {
    const url = `${environment.apiUrl}/boards/${boardId}`;
    return this.http.get<IBoard>(url);
  }

  updateBoard(boardId: string, fields: {title: string}): void {
    this.socket.emit(SocketEventsEnum.boardsUpdate, { boardId, fields });
  }
  deleteBoard(boardId: string): void {
    this.socket.emit(SocketEventsEnum.boardsDelete, { boardId});
  }
}
