import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private readonly BOT_TOKEN = '7825086890:AAHKb98bzxvzRPaydcFkPZiXv1QxZTSUuQA';
  private readonly CHAT_ID = '1116071397';

  constructor(private http: HttpClient) {}

  sendMessage(formData: any) {
    const message = this.formatMessage(formData);

    // Используем полный путь для прокси
    const url = `/api/telegram/sendMessage`;

    console.log('Отправка сообщения:', { url, message });

    return this.http.post(url, {
      chat_id: this.CHAT_ID,
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
