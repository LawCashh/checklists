import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../data.service";
import {ChecklistFull} from "../checklist.model";

@Component({
  selector: 'app-checklist-setup',
  templateUrl: './checklist-setup.component.html',
  styleUrls: ['./checklist-setup.component.scss']
})
export class ChecklistSetupComponent implements OnInit{

  checklistId: string = "";
  checklistObject: any;

  constructor(private activatedRoute: ActivatedRoute, private http: DataService) {
  }
  ngOnInit(): void {
    this.checklistId = this.activatedRoute.snapshot.params['id'];
    this.http.getData<ChecklistFull>("http://api-development.synergysuite.net/rest/checklists/tasks/"
      + this.checklistId).subscribe(
      {
        next: res => {
          this.checklistObject = res;
          console.log("uspio get detalja");
        },
        error: err => {
          console.log("error za get detalja checkliste, error je " + err);
        }
      }
    )
  }

}
