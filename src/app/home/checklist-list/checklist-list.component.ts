import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {concatMap, Observable, Subscription, switchMap} from "rxjs";
import {DataService} from "../../data.service";
import {SharedService} from "../../shared/shared.service";
import {Checklist} from "../checklist.model";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

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
  newChecklistName = "";
  addingChecklist = false;
  @ViewChild('checklistInput') checklistInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('checklistsRef') checklistsRef: ElementRef<HTMLDivElement> | undefined;
  globalListenFunc: Function | undefined;
  startX: number = 0;
  startY: number = 0;
  isSwiping = false;
  isDeleteModalOpen = false;
  checklistToDeleteId = "";
  isErrorModalOpen = false;
  errorType : "checklistAdd" | "checklistDelete" = "checklistAdd";
  completedSubtasksForChecklist: number[] = [];
  numberOfSubtasksForChecklist: number[] = [];
  addingChecklistFormOpen = false;
  //isDragging = false; mozda za desktop verziju, mozda iskoristi isSwiping

  constructor(private http: DataService, private shared: SharedService,
              private elementRef : ElementRef, private renderer: Renderer2,
              private router: Router) {
  }
  ngOnInit(): void {
    this.ucitavanjeChecklisti();
  }

  ucitavanjeChecklisti() {
    this.isLoadingChecklists = true;
    this.makeHttpCallAfterSubject().subscribe({
      next: res => {
        this.checklists = res;
        for (let i = 0; i < this.checklists.length; i++){
          let checklistCurr = this.checklists[i];
          if (checklistCurr.subTasks == null){
            this.completedSubtasksForChecklist[i] = 0;
            this.numberOfSubtasksForChecklist[i] = 0;
          }
          else {
            const subTaskovi = checklistCurr.subTasks;
            this.numberOfSubtasksForChecklist[i] = subTaskovi.length;
            let currCompleted = 0;
            for (let j = 0; j < subTaskovi.length; j++){
              let currResult = subTaskovi[j].result;
              if(currResult !== null){
                if(currResult.completed) currCompleted++;
              }
            }
            this.completedSubtasksForChecklist[i] = currCompleted;
          }
        }
        this.isLoadingChecklists = false;
      }, error: err => {
        console.log("err makeHttpCallAfterSubject " + err);
        this.router.navigate(["error"]);
      }
    });
    let id = localStorage.getItem(`selectedOutlet`);
    if (id !== null)
      this.shared.changeOutlet(id);
    else this.shared.changeOutlet(this.shared.outletId);
  }

  deleteChecklist(checklistId: string) {
      this.isLoadingChecklists = true;
      this.isDeleteModalOpen = true;
      this.checklistToDeleteId = checklistId;
  }
  confirmDeleteChecklist(){
    this.http.deleteChecklist("http://api-development.synergysuite.net/rest/checklists/tasks/", this.checklistToDeleteId).subscribe({
      next: res => {
        console.log(JSON.stringify(res));
        this.isDeleteModalOpen = false;
        this.ucitavanjeChecklisti();
      },
      error: err => {
        console.log("greska u brisanju checkliste, error je " + err);
        this.isDeleteModalOpen = false;
        this.errorType = "checklistDelete";
        this.isErrorModalOpen = true;
      }
    });
  }
  cancelDeleteChecklist(){
    this.isDeleteModalOpen = false;
    this.addingChecklist = false;
    this.ucitavanjeChecklisti();
  }
  error() {
    this.isErrorModalOpen = false;
    this.ucitavanjeChecklisti();
  }
  onTouchStart(event: TouchEvent, parentDiv: HTMLDivElement) {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
    this.isSwiping = true;
  }


  onTouchEnd(event: TouchEvent, parentDiv: HTMLDivElement) {
    this.isSwiping = false;
    let target = event.target as HTMLElement;
    if (parentDiv.style.transform !== 'translateX(-120px)'){
      parentDiv.style.transform = 'translateX(0)';
      setTimeout(() => {
        this.addingChecklist = false;
      }, 200);
    }
    //ova linija za micanje +
    else this.addingChecklist = true;
  }

  onTouchMove(event: TouchEvent, parentDiv: HTMLDivElement) {
    let target = event.target as HTMLElement;
    if (!this.isSwiping) return;
    const deltaX = event.touches[0].clientX - this.startX;
    const deltaY = event.touches[0].clientY - this.startY;
    const maxDelta = parentDiv.offsetWidth - window.innerWidth;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        parentDiv.style.transform = `translateX(${-Math.min(
            -deltaX,
            maxDelta
        )}px)`;
      } else {
        let delta = -(-120 + deltaX);
        parentDiv.style.transform = `translateX(${-Math.min(
            delta,
            maxDelta
        )}px)`;
      }
    }
    else {

    }
  }
  onMouseDown(event: MouseEvent, parentDiv: HTMLDivElement) {
    this.startX = event.clientX;
    //this.startY = event.clientY;
    this.isSwiping = true;
  }
  onMouseUp(event: MouseEvent, parentDiv: HTMLDivElement) {
    this.isSwiping = false;
    let target = event.target as HTMLElement;
    if (parentDiv.style.transform !== 'translateX(-120px)')
      parentDiv.style.transform = 'translateX(0)';
  }
  onMouseMove(event: MouseEvent, parentDiv: HTMLDivElement) {
    let target = event.target as HTMLElement;
    if (!this.isSwiping) return;
    const deltaX = event.clientX - this.startX;
    const maxDelta = parentDiv.offsetWidth - window.innerWidth;

    if (deltaX < 0) {
      parentDiv.style.transform = `translateX(${-Math.min(
          -deltaX,
          maxDelta
      )}px)`;
    } else {
      let delta = -(-120 + deltaX);
      parentDiv.style.transform = `translateX(${-Math.min(
          delta,
          maxDelta
      )}px)`;
    }
  }
  // getSubTaskList(checklistId: string) {
  //   return this.getBusinessDate().pipe(
  //       switchMap(firstResponse => {
  //         let outlet = localStorage.getItem("selectedOutlet");
  //         if (outlet == null) outlet = this.shared.outletId;
  //         return this.http.getData("http://api-development.synergysuite.net/rest/checklists/tasks/" +
  //           checklistId + "/subtasks?id=" +
  //           checklistId + "&companyId=" +
  //           outlet + "&personId=1490106392118050028&date="
  //           + firstResponse);
  //       })
  //   );
  // }
  makeHttpCallAfterSubject(): Observable<Checklist[]> {
    return this.shared.checklistRefreshSubject.pipe(
      switchMap(data => {
        this.isLoadingChecklists = true;
        const firstHttpCall = this.getBusinessDate();
        return firstHttpCall.pipe(
          concatMap(firstResponse => {
            let outlet = localStorage.getItem("selectedOutlet");
            if (outlet == null) outlet = this.shared.outletId;
            return this.http.getData<Checklist[]>("http://api-development.synergysuite.net/rest/checklists/tasks?date=" +
              firstResponse + "&companyId=" + outlet + "&corporateId=500000000&personId=1490106392118050028&type=CHECK_LIST");
          })
        );
      })
    );
  }
  getBusinessDate (){
      let outlet = localStorage.getItem('selectedOutlet');
      if(outlet == null) outlet = this.shared.outletId;
      return this.http.getData<string>("http://api-development.synergysuite.net/rest/companyDates/currentBusinessDate/"
      + outlet);
  }

  goToAddChecklist() {
    this.addingChecklist=true;
    this.addingChecklistFormOpen = true;
    setTimeout(() => {
      if (this.checklistInput) {
        this.checklistInput.nativeElement.focus();
      }
    });
  }

  addChecklist(checklistForm: NgForm){
    this.addingChecklistFormOpen = false;
    this.addingChecklist = false;
    let id = localStorage.getItem("selectedOutlet");
    if (id == null) id = this.outletId;
    const newChecklist = {
      "name": this.newChecklistName,
      "validDays": "montuewedthufrisatsun",
      "companyId": id,
      "corporateId": this.shared.corporateId,
      "personId": this.shared.userId
    }
    this.isLoadingChecklists = true;
    this.http.postChecklist("http://api-development.synergysuite.net/rest/checklists/tasks/CHECK_LIST",
      newChecklist).subscribe({
      next: res => {
        console.log("Kreirana nova checkliste, response je " +
        JSON.stringify(res));
        this.ucitavanjeChecklisti();
      },
      error: err => {
        console.log("error na kreiranje nove checkliste, response je " +
          err);
        this.errorType = "checklistAdd";
        this.isErrorModalOpen = true;
      }
      });
    checklistForm.resetForm();
  }
  returnGradient(percentage: number): string {
    let percent = percentage;
    if (isNaN(percent) || percent <=0) {
      percent = 0;
    }
    else percent = parseInt(percent.toFixed(0));
    const orangeAngle = (percent / 100) * 360;
    const grayAngle = 360 - orangeAngle;

    return `
      conic-gradient(
        from 0deg,
        orange 0deg ${orangeAngle}deg,
        lightgray ${orangeAngle}deg ${grayAngle}deg
      )
    `;
  }

  setupChecklist(id: string) {
      this.shared.naSetupSaRoot = true;
      this.router.navigate(["setup-checklist", id]);
  }
  openChecklist(id: string) {
      this.router.navigate(["open-checklist", id]);
  }
  ngOnDestroy(): void {
    this.subRefresh.unsubscribe();
  }
}
