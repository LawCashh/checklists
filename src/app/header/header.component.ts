import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  isSetupRoute() {
      return this.router.url.includes("setup-checklist");
  }

  isRootRoute() {
    return this.router.url === "/";
  }

}
