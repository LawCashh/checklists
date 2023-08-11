import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistSetupComponent } from './checklist-setup.component';

describe('ChecklistSetupComponent', () => {
  let component: ChecklistSetupComponent;
  let fixture: ComponentFixture<ChecklistSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistSetupComponent]
    });
    fixture = TestBed.createComponent(ChecklistSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
