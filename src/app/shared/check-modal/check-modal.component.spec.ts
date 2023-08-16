import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckModalComponent } from './check-modal.component';

describe('CheckModalComponent', () => {
  let component: CheckModalComponent;
  let fixture: ComponentFixture<CheckModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckModalComponent]
    });
    fixture = TestBed.createComponent(CheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
