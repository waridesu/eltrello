import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { BoardsService } from "../../../../../shared/services/boards.service";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { BoardService } from "../../../services/board.service";
import { filter, Observable } from "rxjs";
import { BoardInterface } from "../../../../../shared/types/board.interface";
import { SocketService } from "../../../../../shared/services/socket.service";
import { SocketEventsEnum } from "../../../../../shared/types/socket-events.enum";

@Component({
  selector: 'board',
  standalone: true,
  imports: [CommonModule],
  providers: [BoardsService, BoardService],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardInterface>;
  constructor(private boardsService: BoardsService,
              private route: ActivatedRoute,
              private router: Router,
              private boardService: BoardService,
              private socketSvc: SocketService) {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (!boardId) {
      throw new Error('Board id is not defined');
    }
    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }
  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((data) => {
      this.boardService.setBoard(data);
    });
  }
  ngOnInit(): void {
    this.socketSvc.emit(SocketEventsEnum.boardsJoin, { boardId: this.boardId})
    this.fetchData();
    this.initiateSocketListeners();
  }
  initiateSocketListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('leaving board');
        this.boardService.leaveBoard(this.boardId);
      }
    });
  }
}
