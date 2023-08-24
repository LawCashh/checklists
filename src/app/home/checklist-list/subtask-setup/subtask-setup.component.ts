import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../data.service";
import {SharedService} from "../../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {SubtaskFull} from "../../checklist.model";

@Component({
  selector: 'app-subtask-setup',
  templateUrl: './subtask-setup.component.html',
  styleUrls: ['./subtask-setup.component.scss']
})
export class SubtaskSetupComponent implements OnInit, OnDestroy{
  subtaskId: string = "";
  subtaskObject: any;
  isLoadingSetup = true;
  maxDescLength: number = 250;
  currDescLength: number = 0;
  descText: string | null = "";
  name: string = "";
  lastDay: boolean = false;
  important: boolean = false;
  urgent: boolean = false;
  isSaveModalOpen = false;
  isErrorModalOpen: boolean = false;
  isCheckModalOpen: boolean = false;
  checkModalSubscription = new Subscription();
  deleteModalSubscription = new Subscription();
  isDeleteModalOpen = false;
  errorType: 'taskEdit' | 'taskDelete' = 'taskEdit';
  completeByTime: string | null = "";
  showTimePicker: boolean = false;
  @ViewChild('timeInput') timeInputRef!: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private http: DataService,
              private router: Router, private shared: SharedService) {
  }


  updateDescLength() {
    if(this.descText !== null)
      this.currDescLength = this.descText.length;
  }

  setupSubtask(setupSubtaskForm: NgForm){
    this.isSaveModalOpen = true;
  }
  ngOnInit(): void {
    this.checkModalSubscription = this.shared.getSetupCheckModalObservable().subscribe(value => {
      this.isCheckModalOpen = value;
    });
    this.deleteModalSubscription = this.shared.getSetupDeleteModalObservable().subscribe(value => {
      this.isDeleteModalOpen = value;
    });
    this.subtaskId = this.activatedRoute.snapshot.params['id'];
    this.ucitavanjeDetaljaSubtaska();
  }

  ucitavanjeDetaljaSubtaska() {
    this.isLoadingSetup = true;
    this.http.getData<SubtaskFull>("http://api-development.synergysuite.net/rest/checklists/subtasks/"
        + this.subtaskId).subscribe(
        {
          next: res => {
            this.subtaskObject = res;
            console.log("uspio get detalja, evo ih " + JSON.stringify(this.subtaskObject));
            this.name = res.name;
            this.descText = res.description;
            this.important = res.important;
            this.urgent = res.urgent;
            this.lastDay = res.lastDayOfMonth;
            this.isLoadingSetup = false;
            this.completeByTime = res.completeByTime;
            if(res.description!== null)
              this.currDescLength = res.description?.length;
          },
          error: err => {
            console.log("error za get detalja subtaska, error je " + err);
            this.router.navigate(["error"]);
          }
        }
    );
  }

  confirmSetupSubtask(setupSubtaskForm: NgForm) {
    this.isSaveModalOpen = false;
    const updateInfo = {
      "id": this.subtaskId,
      "taskId": this.subtaskObject.taskId,
      "dependsOn": this.subtaskObject.dependsOn,
      "name": this.name,
      "description": this.descText,
      "linkedWizard": this.subtaskObject.linkedWizard,
      "wizardId": this.subtaskObject.wizardId,
      "wizardArguments": this.subtaskObject.wizardArguments,
      "wizardMarksComplete": this.subtaskObject.wizardMarksComplete,
      "urgent": this.urgent,
      "important": this.important,
      "validDays": this.subtaskObject.validDays,
      "validDates": this.subtaskObject.validDates,
      "lastDayOfMonth": this.lastDay,
      "completeByTime": this.completeByTime,
      "rank": this.subtaskObject.rank,
      "overridable": this.subtaskObject.overridable,
      "deleted": this.subtaskObject.deleted,
      "deletedTime": this.subtaskObject.deletedTime,
      "companyId": this.subtaskObject.companyId,
      "taskEnabledForCompanies": this.subtaskObject.taskEnabledForCompanies,
      "subTaskEnabledForCompanies": this.subtaskObject.subTaskEnabledForCompanies,
      "completeBy": this.subtaskObject.completeBy
    }
    this.http.postChecklist("http://api-development.synergysuite.net/rest/checklists/subtasks",
        updateInfo).subscribe({
      next: res => {
        console.log("Updateovan subtask, response je " +
            JSON.stringify(res));
        setupSubtaskForm.resetForm();
        this.idiNazad();
      },
      error: err => {
        console.log("error na update subtaska, response je " +
            err);
        setupSubtaskForm.resetForm();
        this.errorType = 'taskEdit';
        this.isErrorModalOpen = true;
      }
    });
  }

  error() {
    this.isErrorModalOpen = false;
    this.idiNazad();
  }
  cancelEverything(setupSubtaskForm: NgForm){
    setupSubtaskForm.resetForm();
    this.idiNazad();
  }
  idiNazad() {
    this.router.navigate(["open-checklist", this.subtaskObject.taskId])
        .then(() => {
          console.log('Navigation successful');
        })
        .catch(error => {
          console.error('Navigation error', error);
        });
  }
  cancelSetupSubtask() {
    this.isSaveModalOpen = false;
  }
  ngOnDestroy(): void {
    this.checkModalSubscription.unsubscribe();
    this.deleteModalSubscription.unsubscribe();
  }

  brisanjeSubtaskaIzSetupa() {
    this.http.deleteSubtask("http://api-development.synergysuite.net/rest/checklists/subtasks/", this.subtaskId).subscribe({
      next: res => {
        console.log(JSON.stringify(res));
        this.isDeleteModalOpen = false;
        this.idiNazad();
      },
      error: err => {
        console.log("greska u brisanju subtaska, error je " + err);
        this.isDeleteModalOpen = false;
        this.errorType = "taskDelete";
        this.isErrorModalOpen = true;
      }
    });
  }
  // formatTime() {
  //     if(this.completeByTime !== null){
  //       const parts = this.completeByTime.split(":");
  //       const hours = parts[0].padStart(2, '0');
  //       const minutes = parts[1].padStart(2, '0');
  //       if(parseInt(hours) < 8 || (parseInt(hours) == 18 && parseInt(minutes) > 0)|| parseInt(hours) > 18){
  //         this.timeError = true;
  //       }
  //       else this.timeError = false;
  //       this.completeByTime = `${hours}:${minutes}`;
  //       this.showTimePicker = false;
  //     }
  // }

  openTimeChange() {
    // this.timeInputRef.nativeElement.style.visibility = "visible";
    let el = this.timeInputRef.nativeElement as HTMLInputElement;
    el.showPicker();
  }

  hasTimeError(completeByTime: null | string) {
      if(completeByTime == null) return false
      const parts = this.completeByTime!.split(":");
      const hours = parts[0].padStart(2, '0');
      const minutes = parts[1].padStart(2, '0');
      if(parseInt(hours) < 8 || (parseInt(hours) == 18 && parseInt(minutes) > 0)|| parseInt(hours) > 18){
        return true;
      }
      return false;
  }

  isIphoneOrIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
}
