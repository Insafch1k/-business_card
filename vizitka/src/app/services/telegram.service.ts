import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private readonly BOT_TOKEN = environment.TELEGRAM_BOT_TOKEN;
  private readonly CHAT_ID = environment.TELEGRAM_CHAT_ID;

  constructor(private http: HttpClient) {}

  sendMessage(formData: any) {
    const message = this.formatMessage(formData);
    const url = `/api/telegram${this.BOT_TOKEN}/sendMessage?chat_id=${this.CHAT_ID}`;

    console.log('Отправка сообщения:', {
      url,
      message,
      botToken: this.BOT_TOKEN,
      chatId: this.CHAT_ID,
    });

    return this.http
      .post(url, {
        text: message,
        parse_mode: 'HTML',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Ошибка Telegram API:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
          });
          return throwError(
            () => new Error('Ошибка отправки сообщения в Telegram')
          );
        })
      );
  }

  private formatMessage(data: any): string {
    return `
<b>Новая заявка с сайта</b>
<b>Имя:</b> ${data.name}
<b>Телефон:</b> ${data.phone}
<b>Текст:</b> ${data.text || 'не указано'}
    `;
  }
}
