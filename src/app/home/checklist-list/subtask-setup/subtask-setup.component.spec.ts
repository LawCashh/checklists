import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskSetupComponent } from './subtask-setup.component';

describe('SubtaskSetupComponent', () => {
  let component: SubtaskSetupComponent;
  let fixture: ComponentFixture<SubtaskSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubtaskSetupComponent]
    });
    fixture = TestBed.createComponent(SubtaskSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
