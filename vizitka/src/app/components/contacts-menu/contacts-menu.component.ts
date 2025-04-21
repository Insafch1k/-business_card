import { Component } from '@angular/core';
import { ContactsMenuService } from './contacts-menu.service';

@Component({
  selector: 'app-contacts-menu',
  templateUrl: './contacts-menu.component.html',
  styleUrls: ['./contacts-menu.component.scss'],
})
export class ContactsMenuComponent {
  constructor(public menuService: ContactsMenuService) {}

  goToContacts() {
    // Закрываем меню
    this.menuService.closeMenu();

    // Прокручиваем страницу до элемента с id="contactsSection"
    const contactsElement = document.getElementById('contactsSection');
    if (contactsElement) {
      contactsElement.scrollIntoView({
        behavior: 'smooth', // Для плавной прокрутки
        block: 'start',
      });
    }
  }

  closeMenu() {
    this.menuService.closeMenu();
  }
}
