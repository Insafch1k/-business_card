import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TelegramService } from '../../services/telegram.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  contactForm!: FormGroup;
  isSending = false;
  errorMessage = '';
  showSuccessModal = false;

  constructor(
    private fb: FormBuilder,
    private telegramService: TelegramService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '+7',
        [
          Validators.required,
          Validators.pattern(/^\+7[0-9]{10}$/),
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ],
      text: [''],
    });
  }

  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (!value.startsWith('7')) {
      value = '7' + value;
    }

    value = value.substring(0, 11);

    let formatted = '+7';
    if (value.length > 1) {
      formatted += ' (' + value.substring(1, 4);
    }
    if (value.length >= 4) {
      formatted += ') ' + value.substring(4, 7);
    }
    if (value.length >= 7) {
      formatted += '-' + value.substring(7, 9);
    }
    if (value.length >= 9) {
      formatted += '-' + value.substring(9, 11);
    }

    input.value = formatted;
    this.contactForm.get('phone')?.setValue('+7' + value.substring(1), {
      emitEvent: false,
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.errorMessage = '';
    this.showSuccessModal = false;

    this.telegramService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.showSuccessModal = true;
        this.contactForm.reset({ phone: '+7' });
      },
      error: (err) => {
        this.errorMessage = 'Ошибка отправки формы. Попробуйте позже.';
      },
      complete: () => {
        this.isSending = false;
      },
    });
  }

  private markAllAsTouched() {
    Object.values(this.contactForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  hideSuccessModal() {
    this.showSuccessModal = false;
  }
}
