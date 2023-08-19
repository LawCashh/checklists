import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "../shared/shared.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  currentChecklistId: string | null = "";
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private shared: SharedService, private location: Location) {
  }

  ngOnInit(): void {

  }
  isChecklistSetupRoute() {
      return this.router.url.includes("setup-checklist");
  }

  isRootRoute() {
    return this.router.url === "/";
  }

  goBackFromSetupChecklist() {
    this.shared.setSetupCheckModal(true);
  }
  deleteChecklistFromSetup() {
    this.shared.setSetupDeleteModal(true);
  }

  isOpenChecklistRoute() {
    return this.router.url.includes("open-checklist");
  }

  goBackFromOpenChecklist() {
    //Ovo postavi na ovo ako bude trebala da se vrsi konfirmacija prije go back
    //Lindon rekao da ne
    this.router.navigate([""]);
    // this.shared.setOpenChecklistModal(true);
  }

  goToSetupRouteFromOpenChecklist() {
    let checklistId = this.location.path().slice(16, this.location.path().length);
    this.router.navigate(["setup-checklist", checklistId]);
  }

  isSubtaskSetupRoute() {
    return this.router.url.includes("setup-subtask");
  }

  goBackFromSetupSubtask() {
    this.shared.setSetupCheckModal(true);
  }

  deleteSubtaskFromSetup() {
    this.shared.setSetupDeleteModal(true);
  }
  isErrorRoute() {
    return this.router.url.includes("error");
  }

  goHome() {
    this.router.navigate([""]);
  }
}
