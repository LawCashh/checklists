import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent implements OnInit{
  @Output() confirm = new EventEmitter<{ noteText: string, subtaskId: string, index: number}>();
  @Output() cancel = new EventEmitter<void>();
  @Input() noteIs:  "new" | "existing" = "new";
  @Input() noteValue: string = "";
  noteNameTwoWay: string = "";
  @Input() title : string = "";
  @Input() subtaskId: string = "";
  @Input() subtaskIndex: number = 0;

  ngOnInit(): void {
    this.noteNameTwoWay = this.noteValue;
  }
  onConfirm(noteForm: NgForm): void {
    this.confirm.emit({
      noteText: this.noteNameTwoWay,
      subtaskId: this.subtaskId,
      index: this.subtaskIndex
    });
    noteForm.resetForm();
  }

  onCancel(): void {
    this.cancel.emit();
  }


}
