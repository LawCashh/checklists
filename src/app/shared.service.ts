import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userId = "1490106392118050028";
  corporateId = "500000000";
  token = "82dbdf03-a920-42d3-ba4c-9f68bc62522c";
  outletId = "500000101";
  checklistRefreshSubject = new Subject();
  constructor() { }

  changeOutlet(newId: string){
    this.outletId = newId;
    this.checklistRefreshSubject.next(this.outletId);
  }
}
