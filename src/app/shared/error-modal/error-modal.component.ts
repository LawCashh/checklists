import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() kojiError:  "checklistAdd" | "checklistDelete" | "taskAdd" | "taskDelete" = "checklistAdd";

  onClose(): void {
    this.close.emit();
  }
}
