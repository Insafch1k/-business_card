import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SuccessComponent {
  @Input() checkmarkPath: string = 'path-to-default-checkmark.svg';
  @Input() successMessage: string = 'Ваша заявка успешно отправлена';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
