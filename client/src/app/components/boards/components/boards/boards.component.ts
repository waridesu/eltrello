import { Component, OnInit } from '@angular/core';
import { BoardsService } from "../../../../shared/services/boards.service";

@Component({
  selector: 'app-boards',
  standalone: true,
  providers: [BoardsService],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  constructor(private boardsSvc: BoardsService) {
  }

  ngOnInit() {
    this.boardsSvc.getBoards().subscribe((boards) => {
      console.log(boards);
    });
  }
}
