import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-setup-modal',
  templateUrl: './setup-modal.component.html',
  styleUrls: ['./setup-modal.component.scss']
})
export class SetupModalComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Input() staSetupujem:  "checklist" | "task" = "task";

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
