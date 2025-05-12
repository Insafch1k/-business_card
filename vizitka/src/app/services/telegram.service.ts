import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private readonly API_URL = 'http://192.168.31.248:5000';

  constructor(private http: HttpClient) {}

  sendMessage(formData: any) {
    const payload = {
      name: formData.name,
      message: formData.phone,
      number: formData.text,
    };

    return this.http
      .post(this.API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Ошибка отправки:', {
            status: error.status,
            message: error.message,
            error: error.error,
          });
          return throwError(() => new Error('Ошибка отправки сообщения'));
        })
      );
  }
}
