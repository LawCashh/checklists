import {Component, OnInit} from '@angular/core';
import {Event} from "@angular/router";
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  outletId: string = "500000101";

  constructor(private shared: SharedService) {
  }
  ngOnInit(): void {
  }
  onChangeOption(event: string){
    this.outletId = event;
    this.shared.changeOutlet(event);
  }

}
