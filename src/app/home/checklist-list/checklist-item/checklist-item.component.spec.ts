import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistItemComponent } from './checklist-item.component';

describe('ChecklistItemComponent', () => {
  let component: ChecklistItemComponent;
  let fixture: ComponentFixture<ChecklistItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistItemComponent]
    });
    fixture = TestBed.createComponent(ChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
