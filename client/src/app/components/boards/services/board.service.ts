import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { BoardInterface } from "../../../shared/types/board.interface";
import { SocketService } from "../../../shared/services/socket.service";
import { SocketEventsEnum } from "../../../shared/types/socket-events.enum";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null)

  constructor(private socketSvc: SocketService) {}
  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketSvc.emit(SocketEventsEnum.boardsLeave, { boardId });
  }
}
