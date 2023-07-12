import { Component, HostBinding, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { BoardService } from "../../../../services/board.service";
import { combineLatest, filter, map, Observable, Subject, takeUntil } from "rxjs";
import { ITask } from "../../../../../../shared/types/task.interface";
import { InlineFormComponent } from "../../../../../../shared/components/inline-form/inline-form.component";
import { IColumn } from "../../../../../../shared/types/column.interface";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { TasksService } from "../../../../../../shared/services/tasks.service";
import { SocketService } from "../../../../../../shared/services/socket.service";
import { SocketEventsEnum } from "../../../../../../shared/types/socket-events.enum";

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, InlineFormComponent, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<ITask>;
  data$: Observable<{ task: ITask; columns: IColumn[] }>;
  columnForm = this.fb.group({
    columnId: [''],
  });
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private tasksService: TasksService,
    private socketService: SocketService,
    private fb: FormBuilder
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get boardID from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskID from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      }))
    );

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
        this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (columnId && task.columnId !== columnId) {
          this.tasksService.updateTask(this.boardId, task.id, { columnId });
        }
      });

    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.goToBoard();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }

  updateTaskDescription(taskDesctiption: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDesctiption,
    });
  }

  deleteTask() {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
}
