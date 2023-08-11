import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SharedService} from "./shared.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private shared: SharedService) { }
  loginHeader = new HttpHeaders().set("synergy-login-token", this.shared.token);
  getData<T>(path: string): Observable<T> {
    return this.http.get<T>(path, {'headers': this.loginHeader});
  }
}
