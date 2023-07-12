import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SocketService } from "./socket.service";
import { Observable } from "rxjs";
import { environment } from "../../../environment/environments";
import { SocketEventsEnum } from "../types/socket-events.enum";
import { ITask } from "../types/task.interface";
import { ITaskInput } from "../types/task-input.interface";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getTasks(boardId: string): Observable<ITask[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/tasks`;
    return this.http.get<ITask[]>(url);
  }

  createTask(taskInput: ITaskInput): void {
    this.socketService.emit(SocketEventsEnum.tasksCreate, taskInput);
  }

  updateTask(
    boardId: string,
    taskId: string,
    fields: { title?: string; description?: string; columnId?: string }
  ): void {
    this.socketService.emit(SocketEventsEnum.tasksUpdate, {
      boardId,
      taskId,
      fields,
    });
  }

  deleteTask(boardId: string, taskId: string): void {
    this.socketService.emit(SocketEventsEnum.tasksDelete, { boardId, taskId });
  }
}
