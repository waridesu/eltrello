import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, NavigationStart, Router, RouterOutlet } from "@angular/router";
import { BoardService } from "../../../services/board.service";
import { combineLatest, filter, map, Observable, Subject, takeUntil } from "rxjs";
import { IBoard } from "../../../../../shared/types/board.interface";
import { SocketService } from "../../../../../shared/services/socket.service";
import { SocketEventsEnum } from "../../../../../shared/types/socket-events.enum";
import { ColumnsService } from "../../../../../shared/services/columns.service";
import { IColumn } from "../../../../../shared/types/column.interface";
import { TopBarComponent } from "../../../../../shared/components/topbar/top-bar.component";
import { InlineFormComponent } from "../../../../../shared/components/inline-form/inline-form.component";
import { ITask } from "../../../../../shared/types/task.interface";
import { TasksService } from "../../../../../shared/services/tasks.service";
import { ITaskInput } from "../../../../../shared/types/task-input.interface";
import { BoardsService } from "../../../../../shared/services/boards.service";

@Component({
  selector: 'board',
  standalone: true,
  imports: [CommonModule, TopBarComponent, InlineFormComponent, RouterOutlet],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  data$: Observable<{ board: IBoard, columns: IColumn[], tasks: ITask[] }>;
  unsubscribe$ = new Subject<void>();

  constructor(private boardsService: BoardsService,
              private route: ActivatedRoute,
              private router: Router,
              private boardService: BoardService,
              private socketSvc: SocketService,
              private columnsService: ColumnsService,
              private taskService: TasksService) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('Board id is not defined');
    }
    this.boardId = boardId;
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$
    ])
      .pipe(map(([board, columns, tasks]) =>
        ({board, columns, tasks})));
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((data) => {
      this.boardService.setBoard(data);
    });
    this.columnsService.getColumns(this.boardId).subscribe((data) => {
      this.boardService.setColumns(data);
    });
    this.taskService.getTasks(this.boardId).subscribe((data) => {
      this.boardService.setTasks(data);
    });
  }

  ngOnInit(): void {
    this.socketSvc.emit(SocketEventsEnum.boardsJoin, {boardId: this.boardId})
    this.fetchData();
    this.initiateSocketListeners();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initiateSocketListeners(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        if (event instanceof NavigationStart && !event.url.includes('/boards')) {
          this.boardService.leaveBoard(this.boardId);
        }
      });
    this.socketSvc.listen<IColumn>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });
    this.socketSvc.listen<ITask>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });

    this.socketSvc.listen<IBoard>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedBoard) => {
        this.boardService.updateBoard(updatedBoard);
      });

    this.socketSvc.listen<void>(SocketEventsEnum.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router?.navigateByUrl('/boards');
      });

    this.socketSvc.listen<string>(SocketEventsEnum.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });

    this.socketSvc.listen<IColumn>(SocketEventsEnum.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardService.updateColumn(updatedColumn);
      });

    this.socketSvc.listen<ITask>(SocketEventsEnum.tasksUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedTask) => {
        this.boardService.updateTask(updatedTask);
      });

    this.socketSvc.listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskId) => {
        this.boardService.deleteTask(taskId);
      });
  }

  createColumn(title: string) {
    const columnInput = {boardId: this.boardId, title};
    this.columnsService.createColumn(columnInput);
  }

  getTacksByColumn(id: string, tasks: ITask[]): ITask[] {
    return tasks.filter((task) => task.columnId === id);
  }

  createTask(title: string, columnId: string) {
    const taskInput: ITaskInput = {boardId: this.boardId, title, columnId};
    this.taskService.createTask(taskInput);
  }

  updateBoardName(boardName: string) {
    this.boardsService.updateBoard(this.boardId, {title: boardName});
  }

  deleteBoard() {
    if (confirm('Are you sure you want to delete this board?')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  deleteColumn(columnId: string) {
    if (confirm('Are you sure you want to delete this column?')) {
      this.columnsService.deleteColumn(this.boardId, columnId);
    }
  }

  updateColumnName(columnName: string, columnId: string) {
    this.columnsService.updateColumn(this.boardId, columnId, {title: columnName});
  }

  openTask(taskId: string) {
    this.router?.navigate(['boards', this.boardId, 'tasks', taskId]);
  }
}
