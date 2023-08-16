import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private shared: SharedService) {
  }

  isSetupRoute() {
      return this.router.url.includes("setup-checklist");
  }

  isRootRoute() {
    return this.router.url === "/";
  }

  goBackFromSetupChecklist() {
    this.shared.setSetupCheckModal(true);
    console.log("xd");
  }
}
