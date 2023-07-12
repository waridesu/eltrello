import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { IBoard } from "../../../shared/types/board.interface";
import { SocketService } from "../../../shared/services/socket.service";
import { SocketEventsEnum } from "../../../shared/types/socket-events.enum";
import { IColumn } from "../../../shared/types/column.interface";
import { ITask } from "../../../shared/types/task.interface";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  board$ = new BehaviorSubject<IBoard | null>(null);
  columns$ = new BehaviorSubject<IColumn[]>([]);
  tasks$ = new BehaviorSubject<ITask[]>([]);

  constructor(private socketService: SocketService) {}

  setBoard(board: IBoard): void {
    this.board$.next(board);
  }

  setColumns(columns: IColumn[]): void {
    this.columns$.next(columns);
  }

  setTasks(tasks: ITask[]): void {
    this.tasks$.next(tasks);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }

  addColumn(column: IColumn): void {
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }

  addTask(task: ITask): void {
    const updatedTasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTasks);
  }

  updateBoard(updatedBoard: IBoard): void {
    const board = this.board$.getValue();
    if (!board) {
      throw new Error('Board is not initialized');
    }
    this.board$.next({ ...board, title: updatedBoard.title });
  }

  updateColumn(updatedColumn: IColumn): void {
    const updatedColumns = this.columns$.getValue().map((column) => {
      if (column.id === updatedColumn.id) {
        return { ...column, title: updatedColumn.title };
      }
      return column;
    });
    this.columns$.next(updatedColumns);
  }

  updateTask(updatedTask: ITask): void {
    const updatedTasks = this.tasks$.getValue().map((task) => {
      if (task.id === updatedTask.id) {
        return {
          ...task,
          title: updatedTask.title,
          description: updatedTask.description,
          columnId: updatedTask.columnId,
        };
      }
      return task;
    });
    this.tasks$.next(updatedTasks);
  }

  deleteColumn(columnId: string): void {
    const updatedColumns = this.columns$
      .getValue()
      .filter((column) => column.id !== columnId);
    this.columns$.next(updatedColumns);
  }

  deleteTask(taskId: string): void {
    const updatedTasks = this.tasks$
      .getValue()
      .filter((task) => task.id !== taskId);
    this.tasks$.next(updatedTasks);
  }
}
