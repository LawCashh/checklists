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
  globalListenFunc: Function | undefined;
  startX: number = 0;
  startY: number = 0;
  isSwiping = false;
  isDeleteModalOpen = false;
  checklistToDeleteId = "";
  isErrorModalOpen = false;
  errorType : "checklistAdd" | "checklistDelete" = "checklistAdd";

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
        this.isLoadingChecklists = false;
      }, error: err => {
        console.log("err makeHttpCallAfterSubject " + err);
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
    this.ucitavanjeChecklisti();
  }
  error() {
    this.isErrorModalOpen = false;
    this.ucitavanjeChecklisti();
  }
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
    this.isSwiping = true;
  }


  onTouchEnd(event: TouchEvent) {
    this.isSwiping = false;
    let target = event.target as HTMLElement;
    if (target.style.transform !== 'translateX(-120px)'){
      target.style.transform = 'translateX(0)';
      setTimeout(() => {
        this.addingChecklist = false;
      }, 200);
    }
    //ova linija za micanje +
    else this.addingChecklist = true;
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
        let delta = -(-120 + deltaX);
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
    if (target.style.transform !== 'translateX(-120px)')
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
      let delta = -(-120 + deltaX);
      target.style.transform = `translateX(${-Math.min(
        delta,
        maxDelta
      )}px)`;
    }
  }

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
      return this.http.getData<string>("http://api-development.synergysuite.net/rest/companyDates/currentBusinessDate/"
      + this.outletId);
  }

  goToAddChecklist() {
    this.addingChecklist=true;
    setTimeout(() => {
      if (this.checklistInput) {
        this.checklistInput.nativeElement.focus();
      }
    });
  }

  addChecklist(checklistForm: NgForm){
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

  // cancelNewChecklist(checklistForm: NgForm){
  //   this.newChecklistName = "";
  //   this.addingChecklist = false;
  //   checklistForm.resetForm();
  // }

  setupChecklist(id: string) {
      this.router.navigate(["setup-checklist", id]);
  }

  ngOnDestroy(): void {
    this.subRefresh.unsubscribe();
  }

}
