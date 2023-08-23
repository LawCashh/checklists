import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userId = "1490106392118050028";
  corporateId = "500000000";
  token = "68273de9-c5a7-49a7-bcda-7f7a2a2a0440";
  outletId = "500000101";
  checklistRefreshSubject = new Subject();
  setupCheckModal = false;
  setupCheckModalSubject: Subject<boolean> = new Subject<boolean>();
  setupDeleteModal = false;
  setupDeleteModalSubject = new Subject<boolean>();
  openChecklistModal = false;
  openChecklistModalSubject: Subject<boolean> = new Subject<boolean>();
  naSetupSaRoot = false;
  constructor(private http: HttpClient) { }

  changeOutlet(newId: string){
    this.outletId = newId;
    this.checklistRefreshSubject.next(this.outletId);
  }

  setSetupDeleteModal(value: boolean) {
    this.setupDeleteModal = value;
    this.setupDeleteModalSubject.next(value);
  }
  getSetupDeleteModalObservable(): Observable<boolean> {
    return this.setupDeleteModalSubject.asObservable();
  }

  setSetupCheckModal(value: boolean) {
    this.setupCheckModal = value;
    this.setupCheckModalSubject.next(value);
  }
  getSetupCheckModal() {
    return this.setupCheckModal;
  }
  getSetupCheckModalObservable(): Observable<boolean> {
    return this.setupCheckModalSubject.asObservable();
  }

  getOpenChecklistModalObservable(): Observable<boolean>{
    return this.openChecklistModalSubject.asObservable();
  }

  setOpenChecklistModal(value: boolean) {
      this.openChecklistModal = value;
      this.openChecklistModalSubject.next(value);
  }
}
