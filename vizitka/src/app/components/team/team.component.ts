
import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
interface Category {
  displayName: string; //поле для HTML-форматирования
  icon: string;
  isWide?: boolean; // Новое свойство для широкой карточки
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  constructor(
    private sanitizer: DomSanitizer) {}

  categories: Category[] = [
    {
      displayName: 'ML',
      icon: 'assets/icons/ml.gif',
    },
    {
      displayName: 'FRONTEND',
      icon: 'assets/icons/front.gif',
    },
    {
      displayName: 'UX/UI DESIGN',
      icon: 'assets/icons/design.gif',
    },
    {
      displayName: 'BACKEND',
      icon: 'assets/icons/back.gif',
    },
    {
      displayName: 'MOBILE DEVELOPMENT',
      icon: 'assets/icons/mobile.gif',
      isWide: true // Помечаем последнюю карточку как широкую
    },
  ];

  //для  вывода HTML
  safeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
