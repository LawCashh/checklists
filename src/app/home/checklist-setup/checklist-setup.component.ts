import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../data.service";
import {ChecklistFull} from "../checklist.model";
import {NgForm} from "@angular/forms";
import {SharedService} from "../../shared/shared.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-checklist-setup',
  templateUrl: './checklist-setup.component.html',
  styleUrls: ['./checklist-setup.component.scss']
})
export class ChecklistSetupComponent implements OnInit, OnDestroy{

  checklistId: string = "";
  checklistObject: any;
  isLoadingSetup = true;
  maxDescLength: number = 250;
  currDescLength: number = 0;
  descText: string | null = "";
  name: string = "";
  alertList: string | null = "";
  lastDay: boolean = false;
  isSaveModalOpen = false;
  isErrorModalOpen: boolean = false;
  isCheckModalOpen: boolean = false;
  checkModalSubscription = new Subscription();


  constructor(private activatedRoute: ActivatedRoute, private http: DataService,
                      private router: Router, private shared: SharedService) {
  }


  updateDescLength() {
    if(this.descText !== null)
    this.currDescLength = this.descText.length;
  }

  setupChecklist(setupChecklistForm: NgForm){
    this.isSaveModalOpen = true;
  }
  ngOnInit(): void {
    this.checkModalSubscription = this.shared.getSetupCheckModalObservable().subscribe(value => {
      this.isCheckModalOpen = value;
    });
    this.checklistId = this.activatedRoute.snapshot.params['id'];
    this.ucitavanjeDetaljaCheckliste();
  }

  ucitavanjeDetaljaCheckliste() {
    this.isLoadingSetup = true;
    this.http.getData<ChecklistFull>("http://api-development.synergysuite.net/rest/checklists/tasks/"
      + this.checklistId).subscribe(
      {
        next: res => {
          this.checklistObject = res;
          console.log("uspio get detalja, evo ih " + JSON.stringify(this.checklistObject));
          this.name = res.name;
          this.descText = res.description;
          this.alertList = res.alertRecipients;
          this.lastDay = res.lastDayOfMonth;
          this.isLoadingSetup = false;
          if(res.description!== null)
          this.currDescLength = res.description?.length;
        },
        error: err => {
          console.log("error za get detalja checkliste, error je " + err);
        }
      }
    );
  }

  confirmSetupChecklist(setupChecklistForm: NgForm) {
    this.isSaveModalOpen = false;
    const updateInfo = {
      "id": this.checklistId,
      "workflowId": this.checklistObject.workflowId,
      "corporateId": this.checklistObject.corporateId,
      "companyId": this.checklistObject.companyId,
      "personId": this.checklistObject.personId,
      "name": this.name,
      "description": this.descText,
      "completeByTime": this.checklistObject.completeByTime,
      "rank": this.checklistObject.rank,
      "alertRecipients": this.alertList,
      "validDays": this.checklistObject.validDays,
      "validDates": this.checklistObject.validDates,
      "lastDayOfMonth": this.lastDay,
      "deleted": this.checklistObject.deleted,
      "deletedTime": this.checklistObject.deletedTime,
      "subtasks": this.checklistObject.subtasks,
      "enabled":this.checklistObject.enabled
    }
    this.http.postChecklist("http://api-development.synergysuite.net/rest/checklists/tasks/CHECK_LIST",
      updateInfo).subscribe({
      next: res => {
        console.log("Updateovana checklista, response je " +
          JSON.stringify(res));
        setupChecklistForm.resetForm();
        this.idiNaRoot();
      },
      error: err => {
        console.log("error na update checkliste, response je " +
          err);
        setupChecklistForm.resetForm();
        this.isErrorModalOpen = true;
      }
    });
  }

  error() {
    this.isErrorModalOpen = false;
    this.idiNaRoot();
  }
  cancelEverything(setupChecklistForm: NgForm){
     setupChecklistForm.resetForm();
     this.idiNaRoot();
  }
  idiNaRoot() {
    this.router.navigate([""])
      .then(() => {
        console.log('Navigation successful');
      })
      .catch(error => {
        console.error('Navigation error', error);
      });
  }
  cancelSetupChecklist() {
      this.isSaveModalOpen = false;
  }
  ngOnDestroy(): void {
    this.checkModalSubscription.unsubscribe();
  }
}
