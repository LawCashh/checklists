import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from "../../data.service";
import {Outlet} from "./outlet.model";
import {SharedService} from "../../shared/shared.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-outlet-list',
  templateUrl: './outlet-list.component.html',
  styleUrls: ['./outlet-list.component.scss']
})
export class OutletListComponent implements OnInit, OnDestroy {
  name: string = "";
  outletSub = new Subscription();
  outlets: Outlet[] = [];
  @ViewChild('outletsSRef') outletsSRef : HTMLSelectElement | undefined;
  selectedOutlet = "500000101";
  @Output('optionEmitter') optionEmitter: EventEmitter<string> = new EventEmitter();
  constructor(private http: DataService, private shared: SharedService) {
  }

  ngOnInit(): void {
      let id = localStorage.getItem("selectedOutlet");
      if (id !== null)
      this.selectedOutlet = id;
      else this.selectedOutlet = "500000101";
      this.outletSub = this.getOutletList().subscribe({
        next: res => {
          //console.log(res);
          this.outlets = res;
        },
        error: err => {
          console.log("greska "+ err);
        }
      })
  }


  onSelect() {
    this.shared.outletId = this.selectedOutlet;
    this.optionEmitter.emit(this.selectedOutlet);
    localStorage.setItem("selectedOutlet", this.selectedOutlet);
  }
  getOutletList(): Observable<Outlet[]> {
    return this.http.getData<Outlet[]>(
      "https://api-development.synergysuite.net/rest/permission/allowedCompanies?userId="
      + this.shared.userId);
  }

  ngOnDestroy(): void {
    this.outletSub.unsubscribe();
  }

}
