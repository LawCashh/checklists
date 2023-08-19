import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class ConfirmLeaveGuard<T> implements CanDeactivate<T> {
  private navigationBackDetected = false;

  constructor() {
    window.onpopstate = () => {
      this.navigationBackDetected = true;
    };
  }
  canDeactivate(component: T): boolean | Observable<boolean> {
    if (this.navigationBackDetected) {
      this.navigationBackDetected = false;
      return false;
    }
    // @ts-ignore
    if(component.isCheckModalOpen){
      return true
    }
    return true;
  }
}
