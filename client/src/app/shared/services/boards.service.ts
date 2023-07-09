import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { BoardInterface } from "../types/board.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment/environments";

@Injectable()
export class BoardsService {

  constructor(private http: HttpClient) { }
  getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + "/boards";
    return this.http.get<BoardInterface[]>(url);
  }
}
