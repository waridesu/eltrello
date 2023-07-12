import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environments";
import { Observable } from "rxjs";
import { IColumn } from "../types/column.interface";
import { IColumnInput } from "../types/column-input.interface";
import { SocketService } from "./socket.service";
import { SocketEventsEnum } from "../types/socket-events.enum";

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  constructor(private http: HttpClient, private socket: SocketService) {}
  getColumns(boardId: string): Observable<IColumn[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<IColumn[]>(url);
  }

  createColumn(columnInput: IColumnInput): void {
    this.socket.emit(SocketEventsEnum.columnsCreate, columnInput);
  }

  deleteColumn(boardId: string, columnId: string): void {
    this.socket.emit(SocketEventsEnum.columnsDelete, { boardId, columnId });
  }
  updateColumn(boardId: string, columnId: string, fields: {title: string}): void {
    this.socket.emit(SocketEventsEnum.columnsUpdate, { boardId, columnId, fields });
  }
}
