import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {concatMap, Observable, Subscription, switchMap} from "rxjs";
import {DataService} from "../../data.service";
import {SharedService} from "../../shared.service";
import {Checklist} from "./checklist.model";

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.scss']
})
export class ChecklistListComponent implements OnInit, OnDestroy{
  @Input() outletId : string = "";
  subRefresh = new Subscription();
  checklists : Checklist[] = [];
  isLoadingChecklists = true;

  constructor(private http: DataService, private shared: SharedService) {
  }
  ngOnInit(): void {
    this.makeHttpCallAfterSubject().subscribe({
      next: res => {
        this.checklists = res;
        this.isLoadingChecklists = false;
      }, error: err => {
        console.log("err makeHttpCallAfterSubject " + err);
      }
    });
    this.shared.changeOutlet(this.shared.outletId);
  }

  makeHttpCallAfterSubject(): Observable<Checklist[]> {
    return this.shared.checklistRefreshSubject.pipe(
      switchMap(data => {
        this.isLoadingChecklists = true;
        const firstHttpCall = this.getBusinessDate();
        return firstHttpCall.pipe(
          concatMap(firstResponse => {
            return this.http.getData<Checklist[]>("http://api-development.synergysuite.net/rest/checklists/tasks?date=" +
              firstResponse + "&companyId=" + this.outletId + "&corporateId=500000000&personId=1490106392118050028&type=CHECK_LIST");
          })
        );
      })
    );
  }
  getBusinessDate (){
      return this.http.getData<string>("http://api-development.synergysuite.net/rest/companyDates/currentBusinessDate/"
      + this.outletId);
  }

  ngOnDestroy(): void {
    this.subRefresh.unsubscribe();
  }
}
