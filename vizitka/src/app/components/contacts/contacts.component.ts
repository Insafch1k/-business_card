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
  isSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private telegramService: TelegramService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)],
      ],
      text: [''],
    });
  }

  onSubmit() {
    console.log('Форма отправлена!', this.contactForm.value);
    if (this.contactForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.isSuccess = false;
    this.errorMessage = '';

    this.telegramService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.isSuccess = true;
        this.contactForm.reset();
      },
      error: (err) => {
        console.error('Ошибка отправки:', err);
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
}
