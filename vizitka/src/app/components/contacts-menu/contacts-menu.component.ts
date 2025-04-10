import { Component } from '@angular/core';
import { ContactsMenuService } from './contacts-menu.service';

@Component({
  selector: 'app-contacts-menu',
  templateUrl: './contacts-menu.component.html',
  styleUrls: ['./contacts-menu.component.scss'],
})
export class ContactsMenuComponent {
  constructor(public menuService: ContactsMenuService) {}
  closeMenu() {
    this.menuService.closeMenu();
  }
}
