import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

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

    console.log('Отправка сообщения:', { url, message });

    return this.http.post(url, {
      text: message,
      parse_mode: 'HTML',
    });
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
