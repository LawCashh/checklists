import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SharedService} from "./shared/shared.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private shared: SharedService) { }
  loginHeader = new HttpHeaders().set("synergy-login-token", this.shared.token);
  getData<T>(path: string): Observable<T> {
    return this.http.get<T>(path, {'headers': this.loginHeader});
  }
  postChecklist(path: string, item: any) {
    return this.http.post(path, item, {'headers': this.loginHeader});
  }
  deleteChecklist(path: string, checklistId: string) {
    return this.http.delete(path + checklistId, {'headers': this.loginHeader});
  }
  deleteSubtask(path: string, subtaskId: string) {
    return this.http.delete(path + subtaskId, {'headers': this.loginHeader});
  }
  postSubtask(path: string, item: any) {
    return this.http.post(path, item, {'headers': this.loginHeader});
  }

  postSubtaskAsCompleted(path: string, item: any){
    return this.http.post(path, item, {'headers': this.loginHeader});
  }
  putSubtaskAsCompleted(path: string, item: any) {
    return this.http.put(path, item, {'headers': this.loginHeader});
  }

  postSubtaskAsNA(path: string, item: any) {
    return this.http.post(path, item, {'headers': this.loginHeader});
  }
  putSubtaskAsNA(path: string, item: any) {
    return this.http.put(path, item, {'headers': this.loginHeader});
  }
  postNote(path: string, item: any){
    return this.http.post(path, item, {'headers': this.loginHeader});
  }
  putNote(path: string, item: any){
    return this.http.put(path, item, {'headers': this.loginHeader});
  }
}
