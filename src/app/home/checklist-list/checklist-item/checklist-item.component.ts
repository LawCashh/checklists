import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Checklist, ChecklistFull, Subtask} from "../../checklist.model";
import {DataService} from "../../../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "../../../shared/shared.service";
import {Observable, Subscription, switchMap} from "rxjs";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-checklist-item',
  templateUrl: './checklist-item.component.html',
  styleUrls: ['./checklist-item.component.scss']
})
export class ChecklistItemComponent implements OnInit, OnDestroy{
  isLoadingOpenChecklist = true;
  checklistId = "";
  checklistWithSubtasksObject: any;
  subtasks: Subtask[] = [];
  name = "";
  descText : string | null = "";
  openChecklistModalSubscription = new Subscription();
  isOpenChecklistModalOpen = false;
  startX: number = 0;
  startY: number = 0;
  addingSubtask = false;
  isSwiping = false;
  @ViewChild('subtaskInput') subtaskInput: ElementRef<HTMLInputElement> | undefined;
  newSubtaskName = "";
  isDeleteModalOpen = false;
  subtaskToDeleteId = "";
  isErrorModalOpen = false;
  errorType : "taskAdd" | "taskDelete" = "taskAdd";
  addingSubtaskFormOpen = false;
  //niz za svaki subtask, 0 je empty, 1 je completed, 2 je n/a, 3 empty but has result
  subtasksCompletedNaEmpty: number[] = [];
  showDetails: boolean[] = [];



  constructor(private http: DataService, private activatedRoute: ActivatedRoute,
              private shared: SharedService, private router: Router) {
  }

  ngOnInit(): void {
    this.checklistId = this.activatedRoute.snapshot.params['id'];
    this.openChecklistModalSubscription = this.shared.getOpenChecklistModalObservable().subscribe(value => {
        this.isOpenChecklistModalOpen = value;
    });
    this.ucitavanjeCheckliste();
  }
    ucitavanjeCheckliste () {
        this.ucitavanjeChecklistePartOne().subscribe(
            {
                next: res => {
                    this.checklistWithSubtasksObject = res;
                    console.log("uspio get detalja checkliste sa subtaskovima, evo ih "
                        + JSON.stringify(this.checklistWithSubtasksObject));
                    this.name = res.name;
                    this.descText = res.description;
                    this.subtasks = res.subTasks;
                    for(let i = 0; i < this.subtasks.length; i++){
                        this.showDetails[i] = false;
                        let trenutniSubtask = this.subtasks[i];
                        if(trenutniSubtask.result !== null){
                            if(trenutniSubtask.result.completed==true){
                                this.subtasksCompletedNaEmpty[i] = 1;
                            }
                            else if (trenutniSubtask.result.na==true){
                                this.subtasksCompletedNaEmpty[i] = 2;
                            }
                            else this.subtasksCompletedNaEmpty[i] = 3;
                        } else this.subtasksCompletedNaEmpty[i] = 0;
                    }
                    console.log("listaaa je " + this.subtasksCompletedNaEmpty);
                    this.isLoadingOpenChecklist = false;
                },
                error: err => {
                    console.log("error get detalja checkliste sa subtaskovima, error je " + err);
                }
            }
        );
    }

    deleteSubtask(subtaskId: string) {
        this.isLoadingOpenChecklist = true;
        this.isDeleteModalOpen = true;
        this.subtaskToDeleteId = subtaskId;
    }
    confirmDeleteSubtask(){
        // this.http.deleteSubtask("http://api-development.synergysuite.net/rest/checklists/tasks/", this.subtaskToDeleteId).subscribe({
        //     next: res => {
        //         console.log(JSON.stringify(res));
        //         this.isDeleteModalOpen = false;
        //         this.ucitavanjeCheckliste();
        //     },
        //     error: err => {
        //         console.log("greska u brisanju checkliste, error je " + err);
        //         this.isDeleteModalOpen = false;
        //         this.errorType = "subtaskDelete";
        //         this.isErrorModalOpen = true;
        //     }
        // });
    }

    cancelDeleteSubtask(){
        this.isDeleteModalOpen = false;
        this.ucitavanjeCheckliste();
    }
    error() {
        this.isErrorModalOpen = false;
        this.ucitavanjeCheckliste();
    }

    addSubtask(subtaskForm: NgForm){
        this.addingSubtask = false;
        this.addingSubtaskFormOpen = false;
        let id = localStorage.getItem("selectedOutlet");
        if (id == null) id = this.shared.outletId;
        const newSubtask = {
            "companyId": id,
            "name": this.newSubtaskName,
            "validDays":"montuewedthufrisatsun",
            "taskId": this.checklistId
        }
        this.isLoadingOpenChecklist = true;
        this.http.postSubtask("http://api-development.synergysuite.net/rest/checklists/subtasks/",
            newSubtask).subscribe({
            next: res => {
                console.log("Kreiran novi subtask, response je " +
                    JSON.stringify(res));
                this.ucitavanjeCheckliste();
            },
            error: err => {
                console.log("error na kreiranje nove checkliste, response je " +
                    err);
                this.errorType = "taskAdd";
                this.isErrorModalOpen = true;
            }
        });
        subtaskForm.resetForm();
    }
    markAsNA(subtaskId: string, value: number) {
        if(value == 2 ) return;
        let id = localStorage.getItem("selectedOutlet");
        if (id == null) id = this.shared.outletId;
        let currDate = new Date();
        const hh = currDate.getHours();
        const mn = currDate.getMinutes();
        const ss = currDate.getSeconds();
        let currDateString = currDate.toISOString().split('T')[0];
        const yyyy = currDate.getFullYear();
        let mm = currDate.getMonth() + 1; // mjeseci krecu od 0
        let dd = currDate.getDate();
        let mmString = mm.toString();
        let ddString = dd.toString();
        let hhString = hh.toString();
        let mnString = mn.toString();
        let ssString = ss.toString();
        if (dd < 10) ddString = '0' + dd.toString();
        if (mm < 10) mmString = '0' + mm.toString();
        if (hh < 10) hhString = '0' + hh.toString();
        if (mn < 10) mnString = '0' + mn.toString();
        if (ss < 10) ssString = '0' + ss.toString();

        const currTimeDate = hhString + ":" + mnString + " " + ddString + '/' + mmString + '/' + yyyy;
        const currTimeDateFull = currDateString + "T" + hhString + ":" + mnString + ":" + ssString +
            ".000+01:00";
        const updatedSubtask = {
            "subTaskId": subtaskId,
            "companyId": id,
            "person":{
                "id":this.shared.userId
            },
            "taskDate": currDateString,
            "completedTime": currTimeDate,
            "completedDateTime": currTimeDateFull,
            "completed":false,
            "na":true,
            "note":null,
        }
        this.http.postSubtaskAsNA("http://api-development.synergysuite.net/rest/checklists/subtasks/results/",
            updatedSubtask).subscribe({
            next: res => {
                console.log("uspjesno markovao kao na, res je "+ res);
                this.ucitavanjeCheckliste();
            },
            error: err => {
                console.log("greska za markovanje kao na, err je " + err);
                //ovdje eventualno umjesto ovoga pokazuj error modal
                this.ucitavanjeCheckliste();
            }
        })
    }
    markAsCompletedNoResult(subtaskId: string) {
        let id = localStorage.getItem("selectedOutlet");
        if (id == null) id = this.shared.outletId;
        let currDate = new Date();
        const hh = currDate.getHours();
        const mn = currDate.getMinutes();
        const ss = currDate.getSeconds();
        let currDateString = currDate.toISOString().split('T')[0];
        const yyyy = currDate.getFullYear();
        let mm = currDate.getMonth() + 1; // mjeseci krecu od 0
        let dd = currDate.getDate();
        let mmString = mm.toString();
        let ddString = dd.toString();
        let hhString = hh.toString();
        let mnString = mn.toString();
        let ssString = ss.toString();
        if (dd < 10) ddString = '0' + dd.toString();
        if (mm < 10) mmString = '0' + mm.toString();
        if (hh < 10) hhString = '0' + hh.toString();
        if (mn < 10) mnString = '0' + mn.toString();
        if (ss < 10) ssString = '0' + ss.toString();

        const currTimeDate = hhString + ":" + mnString + " " + ddString + '/' + mmString + '/' + yyyy;
        const currTimeDateFull = currDateString + "T" + hhString + ":" + mnString + ":" + ssString +
            ".000+01:00";

        const updatedSubtask = {
            "subTaskId": subtaskId,
            "companyId": id,
            "person":{"id":this.shared.userId},
            "taskDate": currDateString,
            "completedTime": currTimeDate,
            "completedDateTime": currTimeDateFull,
            "completed":true,
            "na":false,
            "note":null
        }
        this.http.postSubtaskAsCompleted("http://api-development.synergysuite.net/rest/checklists/subtasks/results/",
            updatedSubtask).subscribe({
            next: res => {
                console.log("uspjesno markovao kao complete, res je "+ res);
                this.ucitavanjeCheckliste();
            },
            error: err => {
                console.log("greska za markovanje kao complete, err je " + err);
                //ovdje eventualno umjesto ovoga pokazuj error modal
                this.ucitavanjeCheckliste();
            }
        })
    }
    markAsCompletedHasResult(subtaskResultId: string, subtaskId: string) {
        let id = localStorage.getItem("selectedOutlet");
        if (id == null) id = this.shared.outletId;
        let currDate = new Date();
        const hh = currDate.getHours();
        const mn = currDate.getMinutes();
        const ss = currDate.getSeconds();
        let currDateString = currDate.toISOString().split('T')[0];
        const yyyy = currDate.getFullYear();
        let mm = currDate.getMonth() + 1; // mjeseci krecu od 0
        let dd = currDate.getDate();
        let mmString = mm.toString();
        let ddString = dd.toString();
        let hhString = hh.toString();
        let mnString = mn.toString();
        let ssString = ss.toString();
        if (dd < 10) ddString = '0' + dd.toString();
        if (mm < 10) mmString = '0' + mm.toString();
        if (hh < 10) hhString = '0' + hh.toString();
        if (mn < 10) mnString = '0' + mn.toString();
        if (ss < 10) ssString = '0' + ss.toString();
        const currTimeDate = hhString + ":" + mnString + " " + ddString + '/' + mmString + '/' + yyyy;
        const currTimeDateFull = currDateString + "T" + hhString + ":" + mnString + ":" + ssString +
            ".000+01:00";

        const updatedSubtask = {
            "id": subtaskResultId,
            "subTaskId": subtaskId,
            "companyId": id,
            "person":{"id":"1490106392118050028",
                "lastName":"Suite",
                "firstName":"Synergy",
                "userName":"synergy",
                "knownAs":"Synergy Suite",
                "companyId":"500000000",
                "personTypeId":"1",
                "email":"admin+hq@synergysuite.com"},
            "note":null,
            "history":"",
            "taskDate": currDateString,
            "completed":true,
            "completedTime": currTimeDate,
            "completedDateTime": currTimeDateFull,
            "lateNotificationSent":null,
            "overridden":null,
            "approvalRecordId":null,
            "na":false
        }

        this.http.putSubtaskAsCompleted("http://api-development.synergysuite.net/rest/checklists/subtasks/results/"
            + subtaskResultId, updatedSubtask).subscribe({
            next: res => {
                console.log("uspjesno markovao kao complete(ima result btw), res je "+ res);
                this.ucitavanjeCheckliste();
            },
            error: err => {
                console.log("greska za markovanje kao complete(ima result btw), err je " + err);
                //ovdje eventualno umjesto ovoga pokazuj error modal
                this.ucitavanjeCheckliste();
            }
        });

        this.ucitavanjeCheckliste();
    }

  ucitavanjeChecklistePartOne (): Observable<Checklist> {
      this.isLoadingOpenChecklist = true;
      return this.getBusinessDate().pipe(
          switchMap(firstResponse => {
              let outlet = localStorage.getItem("selectedOutlet");
              if (outlet == null) outlet = this.shared.outletId;
              return this.http.getData<Checklist>("http://api-development.synergysuite.net/rest/checklists/tasks/" +
                  this.checklistId + "/subtasks?id=" +
                  this.checklistId + "&companyId=" +
                  outlet + "&personId=1490106392118050028&date="
                  + firstResponse);
          })
      );
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
  getBusinessDate (){
    let outlet = localStorage.getItem("selectedOutlet");
    if (outlet == null) outlet = this.shared.outletId;
    return this.http.getData<string>("http://api-development.synergysuite.net/rest/companyDates/currentBusinessDate/"
        + outlet);
  }

    onTouchStart(event: TouchEvent) {
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        this.isSwiping = true;
    }


    onTouchEnd(event: TouchEvent) {
        this.isSwiping = false;
        let target = event.target as HTMLElement;
        if (target.style.transform !== 'translateX(-180px)'){
            target.style.transform = 'translateX(0)';
            setTimeout(() => {
                this.addingSubtask = false;
            }, 200);
        }
        //ova linija za micanje +
        else this.addingSubtask = true;
    }

    onTouchMove(event: TouchEvent) {
        let target = event.target as HTMLElement;
        if (!this.isSwiping) return;
        const deltaX = event.touches[0].clientX - this.startX;
        const deltaY = event.touches[0].clientY - this.startY;
        const maxDelta = target.offsetWidth - window.innerWidth;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                target.style.transform = `translateX(${-Math.min(
                    -deltaX,
                    maxDelta
                )}px)`;
            } else {
                let delta = -(-180 + deltaX);
                target.style.transform = `translateX(${-Math.min(
                    delta,
                    maxDelta
                )}px)`;
            }
        }
        else {

        }
    }
    onMouseDown(event: MouseEvent) {
        this.startX = event.clientX;
        //this.startY = event.clientY;
        this.isSwiping = true;
    }
    onMouseUp(event: MouseEvent) {
        this.isSwiping = false;
        let target = event.target as HTMLElement;
        if (target.style.transform !== 'translateX(-180px)')
            target.style.transform = 'translateX(0)';
    }
    onMouseMove(event: MouseEvent) {
        let target = event.target as HTMLElement;
        if (!this.isSwiping) return;
        const deltaX = event.clientX - this.startX;
        const maxDelta = target.offsetWidth - window.innerWidth;

        if (deltaX < 0) {
            target.style.transform = `translateX(${-Math.min(
                -deltaX,
                maxDelta
            )}px)`;
        } else {
            let delta = -(-180 + deltaX);
            target.style.transform = `translateX(${-Math.min(
                delta,
                maxDelta
            )}px)`;
        }
    }

  ngOnDestroy(): void {
      this.openChecklistModalSubscription.unsubscribe();
  }

  goToAddSubtask() {
      this.addingSubtask=true;
      this.addingSubtaskFormOpen = true;
      setTimeout(() => {
          if (this.subtaskInput) {
              this.subtaskInput.nativeElement.focus();
          }
      });
  }

}
