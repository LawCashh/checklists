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


  constructor(private http: DataService, private activatedRoute: ActivatedRoute,
              private shared: SharedService, private router: Router) {
  }

  ngOnInit(): void {
    this.checklistId = this.activatedRoute.snapshot.params['id'];
    this.openChecklistModalSubscription = this.shared.getOpenChecklistModalObservable().subscribe(value => {
        this.isOpenChecklistModalOpen = value;
    });
    this.ucitavanjeCheckliste().subscribe(
        {
          next: res => {
            this.checklistWithSubtasksObject = res;
            console.log("uspio get detalja checkliste sa subtaskovima, evo ih "
                + JSON.stringify(this.checklistWithSubtasksObject));
            this.name = res.name;
            this.descText = res.description;
            this.subtasks = res.subTasks;
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
            // "name": this.newChecklistName,
            // "validDays": "montuewedthufrisatsun",
            // "companyId": id,
            // "corporateId": this.shared.corporateId,
            // "personId": this.shared.userId
        }
        this.isLoadingOpenChecklist = true;
        // this.http.postSubtask("http://api-development.synergysuite.net/rest/checklists/tasks/CHECK_LIST",
        //     newChecklist).subscribe({
        //     next: res => {
        //         console.log("Kreirana nova checkliste, response je " +
        //             JSON.stringify(res));
        //         this.ucitavanjeChecklisti();
        //     },
        //     error: err => {
        //         console.log("error na kreiranje nove checkliste, response je " +
        //             err);
        //         this.errorType = "checklistAdd";
        //         this.isErrorModalOpen = true;
        //     }
        // });
        subtaskForm.resetForm();
    }

  ucitavanjeCheckliste (): Observable<Checklist> {
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
