import { Component, OnInit } from '@angular/core';
import { BoardsService } from "../../../../shared/services/boards.service";
import { BoardInterface } from "../../../../shared/types/board.interface";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { InlineFormComponent } from "../../../../shared/components/inline-form/inline-form.component";
import { CommonModule, NgForOf } from "@angular/common";
import { TopBarComponent } from "../../../../shared/components/topbar/top-bar.component";

@Component({
  selector: 'app-boards',
  standalone: true,
  providers: [BoardsService],
  templateUrl: './boards.component.html',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    InlineFormComponent,
    NgForOf,
    TopBarComponent
  ],
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: BoardInterface[] = [];
  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
